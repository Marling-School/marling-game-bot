import * as logger from 'winston'
import {Client, Message} from 'discord.js';
import dotenv from 'dotenv'

import commands from './commands';
import {connectDb} from "./db/mongoose";
import BotEnabled from './commands/botEnabled';
import autoCreatePlayer from './commands/autoCreatePlayer';
import help from "./commands/help";

// Load environment variables
dotenv.config();

connectDb();

// Configure the logger
logger.configure({
    level: "debug",
    transports: [new logger.transports.Console({
        format: logger.format.simple(),
    })],
});

const client = new Client()

client.on('ready', () => {
    logger.info(`Logged in as ${client.user && client.user.tag}!`);
});

const SIGNAL = '>'

const botEnabled = new BotEnabled();

client.on('message', (msg: Message) => {
    if (!msg.content.startsWith(SIGNAL)) return
    if (msg.author.bot) return;

    logger.info(`Saw a Message: ${msg.content}`);

    const message = msg.content.slice(1);
    const parts = message.split(' ');

    // Prevent any further processing if the bot is disabled
    if (!botEnabled.isEnabled(msg, message, parts)) return;

    // Ensure player exists
    autoCreatePlayer(msg);

    if (parts.length > 0) {
        let found = false

        commands.forEach(command => {
            if (command.aliases.includes(parts[0])) {
                command.run(msg, msg.content, parts)
                found = true
                return
            }
        })

        // Manual check for help command to avoid cyclic import
        if (parts[0].toLocaleLowerCase() === "help") {
            help.run(msg, msg.content, parts)
            return;
        }

        if (!found) {
            msg.channel.send(`Could not find handler for command ${parts[0]}`)
        }

    } else {
        msg.channel.send('Error - Not enough parts when split on space');
    }
})
logger.info('Attempting Login with ' + process.env.DISCORD_SECRET)

client.login(process.env.DISCORD_SECRET);
