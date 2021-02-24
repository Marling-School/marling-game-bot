import { Message } from 'discord.js'
import { Command } from "./types";

import * as logger from "winston";
import { IPlayerDoc } from '../db/model/player';

const addition: Command = {
    description: "Maths Game",
    aliases: ["add", "addition"],
    run: (player: IPlayerDoc, msg: Message, content: string, splitOnSpace: string[]) => {
        msg.channel.send('Welcome to Maths Game')

        const a = 1 + Math.floor(Math.random() * 10);
        const b = 1 + Math.floor(Math.random() * 10);
        const question = `${msg.author.username} - What is ${a} + ${b}?`
        const answer = (a + b).toString();

        const filter = (m: Message) => m.author.id === msg.author.id;
        const collector = msg.channel.createMessageCollector(filter, { max: 1 });
        collector.on('collect', (m: Message) => {
            if (m.content === answer) {
                m.channel.send(`${m.author.username} is Correct!`)
            } else {
                m.channel.send(`${m.author.username} is Incorrect!`)
            }

            return true;
        });
        collector.on('end', collected => {
            logger.info(`Collected ${collected.size} items`);
        });
        msg.channel.send(question);
    }
}

export default addition;