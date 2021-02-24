import { Message, MessageEmbed, MessageReaction, User } from "discord.js";

import { Command } from "../types";

import { IPlayerDoc, Player } from "../../db/model/player";
import Fight, { FightStatus } from "./Fight";
import winston from "winston";

export const Emoji = {
    controller: '🎮',
    heart: '❤️',
    crossedSwords: '⚔️',
    shield: '🛡️',
    flee: '🏃‍♂️',
    j: '🇯'
}

const logger = winston.createLogger()


const ACTION_EMOJIS = [Emoji.crossedSwords, Emoji.shield, Emoji.flee, Emoji.j];

function createFightEmbed({ players, monster, events }: Fight): MessageEmbed {
    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Fight} :crossed_swords:`)
        .setDescription(`Fighting a ${monster.name}`)

    players.forEach(player => {
        embed.addField(player.name, `${Emoji.heart}:${player.health}, ${Emoji.controller}: ${player.xp}`)
    })

    embed.addField(monster.name, `${Emoji.heart}: ${monster.health}, ${Emoji.crossedSwords}: ${monster.strikeProbability * 100}%`)
        .addField('Events', events.join('\n'))
        .setTimestamp();

    return embed
}

const fightMonster: Command = {
    description: "Fight a Monster",
    aliases: ["fightMonster"],
    run: async (firstPlayer: IPlayerDoc, msg: Message, content: string, splitOnSpace: string[]) => {
        const fight = new Fight(firstPlayer);

        const fightMessage: Message = await msg.channel.send(createFightEmbed(fight));
        ACTION_EMOJIS.forEach(async r => await fightMessage.react(r));

        // Watch the reactions
        const filter = (reaction: MessageReaction, user: User) => {
            return ACTION_EMOJIS.includes(reaction.emoji.name);
        };

        const collector = fightMessage.createReactionCollector(filter, { time: 150000 });

        collector.on('collect', async (reaction: MessageReaction, user: User) => {
            const player: IPlayerDoc | null = await Player.findById(user.id);

            if (user.bot) return

            if (!player) {
                await msg.channel.send("No player found")
                return
            }

            await reaction.users.remove(user.id);

            switch (reaction.emoji.name) {
                case Emoji.crossedSwords:
                    fight.attack(player);
                    break;
                case Emoji.flee:
                    fight.flee(player);
                    break;
                case Emoji.shield:
                    fight.defend(player);
                    break;
                case Emoji.j:
                    fight.join(player)
                    break
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
            fight.players.forEach(player => {
                player.save()
            })
        });
    }
}

export default fightMonster;