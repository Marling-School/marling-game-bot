import { Message, MessageReaction, User } from "discord.js";
import { IPlayerDoc } from "../../db/model/player";
import { choose } from "../../utils";
import { Command } from "../types";
import BaseConversion from "./BaseConversion";
import { binary, denary, hexadecimal } from "comp-sci-maths-lib";

const MAX_VALUE: number = 255;



const numberBaseQuiz: Command = {
    aliases: ['numberBaseQuiz', 'num'],
    description: 'Answer a series of questions about number bases, test your knowledge of binary & hexadecimal',
    run: async (firstPlayer: IPlayerDoc, msg: Message, content: string, splitOnSpace: string[]) => {
        const from = choose([binary, denary, hexadecimal]);
        const to = choose([binary, denary, hexadecimal].filter(x => x !== from));

        const conversion = new BaseConversion(MAX_VALUE, from, to);

        const embed = conversion.generateEmbed();

        const quizMessage: Message = await msg.channel.send(embed);
        conversion.to.emojis.forEach(async r => await quizMessage.react(r));

        // Watch the reactions
        const filter = (reaction: MessageReaction, user: User) => {
            return conversion.to.emojis.includes(reaction.emoji.name) && user.id === msg.author.id;
        };

        const collector = quizMessage.createReactionCollector(filter, { time: 150000 });

        collector.on('collect', async (reaction: MessageReaction, user: User) => {
            await reaction.users.remove(user.id);

            conversion.enterDigit(reaction.emoji.name);
            quizMessage.edit(conversion.generateEmbed());

            if (conversion.isFinished()) {
                if (conversion.isCorrect()) {
                    msg.channel.send(`${user.username} got that correct!`)
                } else {
                    msg.channel.send(`${user.username} got that incorrect!`)
                }

                collector.stop();
            }
        });
    }
}

export default numberBaseQuiz;

