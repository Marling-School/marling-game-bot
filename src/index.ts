import * as logger from 'winston'
import { Client, Message, MessageEmbed } from 'discord.js';
import dotenv from 'dotenv'

import commands, { help } from './commands';
import { connectDb } from "./db/mongoose";
import autoCreatePlayer from './commands/autoCreatePlayer';
import { Command, Optional } from './commands/types';
import { IPlayerDoc } from './db/model/player';

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

const DEFAULT_COMMAND_PREFIX = '>'

client.on('message', async (msg: Message) => {
    if (!msg.content.startsWith(process.env.COMMAND_PREFIX || DEFAULT_COMMAND_PREFIX)) return
    if (msg.author.bot) return;

    logger.info(`Saw a Message: ${msg.content}`);

    const message = msg.content.slice(1);
    const parts = message.split(' ');

    // Ensure player exists
    const player: IPlayerDoc = await autoCreatePlayer(msg);

    if (parts.length > 0) {
        // Manual check for help command to avoid cyclic import
        if (parts[0].toLocaleLowerCase() === "help") {
            msg.channel.send(help)
            return;
        }

        const command: Optional<Command> = commands.find(c => c.aliases.includes(parts[0]));

        if (!command) {
            msg.channel.send(`Could not find handler for command ${parts[0]}`);
            return;
        }

        command.run(player, msg, msg.content, parts)

    } else {
        msg.channel.send('Error - Not enough parts when split on space');
    }
})
logger.info('Attempting Login with ' + process.env.DISCORD_SECRET)

client.login(process.env.DISCORD_SECRET);
