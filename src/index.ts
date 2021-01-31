import * as logger from 'winston'
import { Client } from 'discord.js';
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

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
});

client.login(process.env.DISCORD_SECRET);
