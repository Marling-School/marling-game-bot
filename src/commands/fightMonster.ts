import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import * as logger from 'winston';

import { MessageHandler } from "./types";

import { IPlayerDoc, Player } from "../db/model/player";

const CROSSED_SWORDS: string = '⚔️';
const SHIELD: string = '🛡️';

interface IMonster {
    name: string;
    health: number;
}

function createFightEmbed(player: IPlayerDoc, monster: IMonster, lastOutcomes: string[]): MessageEmbed {
    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Adventurer ${player.name} :crossed_swords:`)
        .setDescription('Your Profile')
        .addFields(
            { name: 'XP', value: `${player.xp} 🎮`, inline: true },
            { name: 'Health', value: `${player.health} ❤️`, inline: true },
        )
        .addField('\u200B', '\u200B')
        .addFields(
            { name: 'Monster', value: monster.name, inline: true },
            { name: 'Health', value: `${monster.health} ❤️`, inline: true },
        )
        .addField('Outcome', lastOutcomes.join('\n'))
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

    const monster: IMonster = {
        name: 'Manticore',
        health: 5
    };

    const fightMessage: Message = await msg.channel.send(createFightEmbed(player, monster, ['Starting Fight']));
    [CROSSED_SWORDS, SHIELD].forEach(async r => await fightMessage.react(r));

    // Watch the reactions
    const filter = (reaction: MessageReaction, user: User) => {
        return [CROSSED_SWORDS, SHIELD].includes(reaction.emoji.name) && user.id === msg.author.id;
    };

    const collector = fightMessage.createReactionCollector(filter, { time: 150000 });

    collector.on('collect', (reaction: MessageReaction, user: User) => {
        reaction.users.remove(user.id);

        switch (reaction.emoji.name) {
            case CROSSED_SWORDS:
                // attack
                monster.health -= 1;
                break;
            case SHIELD:
                // defend/fortify
                break;
        }

        const outcomes: string[] = [];

        if (Math.random() < 0.5) {
            player.health -= 1;
            outcomes.push(`${player.name} took damage!`);
        }

        if (player.health <= 0) {
            outcomes.push(`${player.name} was killed by the monster!`);
            player.health = 20; // Reset to a low amount (respawn)
            collector.stop();
        } else if (monster.health <= 0) {
            outcomes.push(`${player.name} Killed the Monster!`);
            player.xp += 100;
            collector.stop();
        } else {
            outcomes.push(`Fight Continues`);
        }

        fightMessage.edit(createFightEmbed(player, monster, outcomes));

        return true;
    });
    collector.on('end', collected => {
        msg.channel.send(`Fight Over, Player: ${player.name}: ${player.health}, XP:${player.xp}, ${monster.name}: ${monster.health}`);

        fightMessage.reactions.removeAll();
        player.save();
    });

    msg.channel.send(`Player ${msg.author.username} is fighting a monster!`)
}

export default fightMonster;