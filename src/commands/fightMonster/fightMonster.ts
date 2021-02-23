import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import * as logger from 'winston';

import { MessageHandler } from "../types";

import { IPlayerDoc, Player } from "../../db/model/player";
import Fight, { FightStatus } from "./Fight";

const CROSSED_SWORDS: string = '⚔️';
const SHIELD: string = '🛡️';
const FLEE: string = '🏃‍♂️';
const ACTION_EMOJIS = [CROSSED_SWORDS, SHIELD, FLEE];

function createFightEmbed({ player, monster, events }: Fight): MessageEmbed {
    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Adventurer ${player.name} :crossed_swords:`)
        .setDescription('Fight Status')
        .addFields(
            { name: 'XP', value: `${player.xp} 🎮`, inline: true },
            { name: 'Health', value: `${player.health} ❤️`, inline: true },
        )
        .addField('\u200B', '\u200B')
        .addFields(
            { name: 'Monster', value: monster.name, inline: true },
            { name: 'Health', value: `${monster.health} ❤️`, inline: true },
            { name: 'Strike Chance', value: `${monster.strikeProbability * 100}%`, inline: true },
        )
        .addField('Outcome', events.join('\n'))
        .setTimestamp();

    return embed;
}

const fightMonster: MessageHandler = async (msg: Message, content: string, splitOnSpace: string[]) => {
    // Find the player in the database
    const player: IPlayerDoc | null = await Player.findById(msg.author.id);
    if (!player) {
        msg.channel.send('Player Not Found');
        return;
    }

    const fight = new Fight(player);

    const fightMessage: Message = await msg.channel.send(createFightEmbed(fight));
    ACTION_EMOJIS.forEach(async r => await fightMessage.react(r));

    // Watch the reactions
    const filter = (reaction: MessageReaction, user: User) => {
        return ACTION_EMOJIS.includes(reaction.emoji.name) && user.id === msg.author.id;
    };

    const collector = fightMessage.createReactionCollector(filter, { time: 150000 });

    collector.on('collect', (reaction: MessageReaction, user: User) => {
        reaction.users.remove(user.id);

        switch (reaction.emoji.name) {
            case CROSSED_SWORDS:
                fight.attack();
                break;
            case FLEE:
                fight.flee();
                break;
            case SHIELD:
                fight.defend();
                break;
        }

        switch (fight.getOutcome()) {
            case FightStatus.MonsterWon: {
                collector.stop();
                break;
            }
            case FightStatus.PlayerWon: {
                collector.stop();
                break;
            }
            case FightStatus.PlayerFlee: {
                collector.stop();
            }
        }

        fightMessage.edit(createFightEmbed(fight));

        return true;
    });
    collector.on('end', collected => {
        fightMessage.reactions.removeAll();
        player.save();
    });
}

export default fightMonster;