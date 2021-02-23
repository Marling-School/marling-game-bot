import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import * as logger from 'winston';

import { MessageHandler } from "../types";

import { IPlayerDoc, Player } from "../../db/model/player";
import Fight, { FightStatus } from "./Fight";

export const Emoji = {
    controller: '🎮',
    heart: '❤️',
    crossedSwords: '⚔️',
    shield: '🛡️',
    flee: '🏃‍♂️'
}

const ACTION_EMOJIS = [Emoji.crossedSwords, Emoji.shield, Emoji.flee];

function createFightEmbed({ player, monster, events }: Fight): MessageEmbed {
    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Adventurer ${player.name} :crossed_swords:`)
        .setDescription(`Fighting a ${monster.name}`)
        .addField(player.name, `${Emoji.heart}:${player.health}, ${Emoji.controller}: ${player.xp}`)
        .addField(monster.name, `${Emoji.heart}: ${monster.health}, ${Emoji.crossedSwords}: ${monster.strikeProbability * 100}%`)
        .addField('Events', events.join('\n'))
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
            case Emoji.crossedSwords:
                fight.attack();
                break;
            case Emoji.flee:
                fight.flee();
                break;
            case Emoji.shield:
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