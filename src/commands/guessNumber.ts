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
    let finished = false;

    const guessMessage: Message = await msg.channel.send(`Is your number ${guess}?`);
    [LEFT_ARROW, CHECK_MARK, RIGHT_ARROW].forEach(async e => await guessMessage.react(e));

    const filter = (reaction: MessageReaction, user: User) => {
        return [LEFT_ARROW, CHECK_MARK, RIGHT_ARROW].includes(reaction.emoji.name) && user.id === msg.author.id;
    };

    // const guessMessage: Message = await msg.channel.send(`Is your number ${guess}?`);
    while (!finished) {
        try {
            const collected = await guessMessage.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })

            collected.forEach((reaction: MessageReaction) => {
                logger.info('Saw ' + reaction.emoji.name);
                reaction.users.remove(msg.author.id);
                // guessMessage.reactions.removeAll();
                switch (reaction.emoji.name) {
                    case CHECK_MARK:
                        msg.channel.send('I win!');
                        finished = true;
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
        } catch (e) {
            logger.warn('Something went wrong observing reactions: ' + e);
            finished = true;
        }
    }
}

export default guessNumber;