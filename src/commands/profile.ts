import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import * as logger from 'winston';

import { IPlayerDoc, Player } from "../db/model/player";
import { Command } from "./types";

const profile: Command = {
    description: "View your profile",
    aliases: ["profile", "p"],
    run: async (player: IPlayerDoc, msg: Message, content: string, splitOnSpace: string[]) => {
        const profileEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Adventurer ${player.name} :crossed_swords:`)
            .setDescription('Your Profile')
            .addFields(
                { name: '❤️ Health', value: ` ${player.health}`, inline: true },
                { name: '🎮 XP', value: `${player.xp} `, inline: true },
                { name: '🏆 Fights Won', value: `${player.fightsWon} `, inline: true },
                { name: '☠️ Fights Lost', value: `${player.fightsLost} `, inline: true },
            )
            .setTimestamp();

        const sent: Message = await msg.channel.send(profileEmbed);
        sent.react('❤️');
        sent.react('🎮');

        const filter = (reaction: MessageReaction, user: User) => {
            return ['🎮', '❤️'].includes(reaction.emoji.name) && user.id === msg.author.id;
        };

        sent.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
            .then(async (collected) => {
                // logic
                msg.channel.send('You reacted')
            }).catch(() => {
                logger.warn('Error Awaiting Reactions to Profile Post')
            });
    }
}

export default profile;