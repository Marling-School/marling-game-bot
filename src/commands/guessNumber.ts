import { Message, MessageReaction, User } from "discord.js";
import { MessageHandler } from "./types";

import * as logger from 'winston';

const LEFT_ARROW = '⬅️';
const RIGHT_ARROW = '➡';
const CHECK_MARK = '☑️';

const guessNumber: MessageHandler = async (msg: Message, content: string, splitOnSpace: string[]) => {
    let guess = 50;
    let min = 1;
    let max = 100;

    const guessMessage: Message = await msg.channel.send(`Is your number ${guess}?`);
    [LEFT_ARROW, CHECK_MARK, RIGHT_ARROW].forEach(async e => await guessMessage.react(e));

    const filter = (reaction: MessageReaction, user: User) => {
        return [LEFT_ARROW, CHECK_MARK, RIGHT_ARROW].includes(reaction.emoji.name) && user.id === msg.author.id;
    };

    const collector = guessMessage.createReactionCollector(filter, { time: 15000 });

    collector.on('collect', (reaction, user) => {
        logger.info(`Collected ${reaction.emoji.name} from ${user.tag}`);

        // Remove this new reaction
        reaction.users.remove(msg.author.id);

        switch (reaction.emoji.name) {
            case CHECK_MARK:
                msg.channel.send('I win!');
                collector.stop();
                break;
            case LEFT_ARROW:
                max = guess - 1;
                guess = guess - Math.floor((guess - min) / 2);
                guessMessage.edit(`Is your number ${guess}?`);
                break;
            case RIGHT_ARROW:
                min = guess + 1;
                guess = guess + Math.floor((max - guess) / 2);
                guessMessage.edit(`Is your number ${guess}?`);
                break;
        }
    });

    collector.on('end', collected => {
        msg.channel.send(`Finished playing with ${msg.author.username}`)
    });
}

export default guessNumber;