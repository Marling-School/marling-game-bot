import * as logger from 'winston'
import { Client, Message } from 'discord.js';
import dotenv from 'dotenv'

// Load environment variables
dotenv.config();

// Configure the logger
logger.configure({
    level: "debug",
    transports: [new logger.transports.Console()],
});

const client = new Client()

client.on('ready', () => {
    logger.info(`Logged in as ${client.user && client.user.tag}!`);
});

const SIGNAL = '>'

client.on('message', msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(SIGNAL)) return;

    const message = msg.content.slice(1);
    const parts = message.split(' ');

    if (parts.length > 0) {
        switch (parts[0]) {
            case 'play':
                msg.channel.send('Welcome to Maths Game')

                const a = 1 + Math.floor(Math.random() * 10);
                const b = 1 + Math.floor(Math.random() * 10);
                const question = `${msg.author.username} - What is ${a} * ${b}?`
                const answer = (a * b).toString();

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
                break;
        }

    } else {
        msg.channel.send('Error - Not enough parts when split on space');
    }
});

client.login(process.env.DISCORD_SECRET);
