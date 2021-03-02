import { Message, MessageReaction, User } from "discord.js";

import { Command } from "../types";

import { IPlayerDoc, Player } from "../../db/model/player";
import Fight, { FightStatus, Emoji } from "./Fight";

const ACTION_EMOJIS = [Emoji.crossedSwords, Emoji.shield, Emoji.flee, Emoji.j];

const fightMonster: Command = {
    description: "Fight a Monster",
    aliases: ["fightMonster"],
    run: async (firstPlayer: IPlayerDoc, msg: Message, content: string, splitOnSpace: string[]) => {
        const fight = new Fight(firstPlayer);

        const fightMessage: Message = await msg.channel.send(fight.createFightEmbed());
        ACTION_EMOJIS.forEach(async r => await fightMessage.react(r));

        // Watch the reactions
        const filter = (reaction: MessageReaction, user: User) => {
            return ACTION_EMOJIS.includes(reaction.emoji.name) && !user.bot;
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

            fightMessage.edit(fight.createFightEmbed());

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