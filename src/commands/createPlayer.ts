import { Message } from "discord.js";
import { MessageHandler } from "./types";

import { Player } from "../db/model/player";

const INITIAL_HEALTH = 100;

const createPlayer: MessageHandler = (msg: Message, content: string, splitOnSpace: string[]) => {
    const created = new Player({ _id: msg.author.id, name: msg.author.username, health: INITIAL_HEALTH, xp: 0 });
    created.save();

    msg.channel.send('Player Created')
}


export default createPlayer;