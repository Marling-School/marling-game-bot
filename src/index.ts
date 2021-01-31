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
type PendingHandler = (msg: Message) => boolean;
let pendingHandler: PendingHandler | undefined;

client.on('message', msg => {
    if (msg.author.bot) return;

    if (!msg.content.startsWith(SIGNAL)) {
        // If we are waiting for a response to something
        if (!!pendingHandler) {
            // If this message satisfies that response
            if (pendingHandler(msg)) {
                // We can remove the pending handler
                pendingHandler = undefined;
            }
        }
        return
    }

    const message = msg.content.slice(1);
    const parts = message.split(' ');

    if (parts.length > 0) {
        switch (parts[0]) {
            case 'play':
                msg.channel.send('Welcome to Maths Game')

                const a = 1 + Math.floor(Math.random() * 10);
                const b = 1 + Math.floor(Math.random() * 10);
                const question = `What is ${a} * ${b}?`
                const answer = (a * b).toString();
                msg.channel.send(question);
                pendingHandler = (response: Message) => {
                    if (response.channel.id === msg.channel.id) {
                        if (response.content === answer) {
                            response.channel.send('Correct!')
                        } else {
                            response.channel.send('Incorrect :(')
                        }

                        return true;
                    }

                    return false;
                }

                break;

        }

    } else {
        msg.channel.send('Error - Not enough parts when split on space');
    }
});

client.login(process.env.DISCORD_SECRET);
