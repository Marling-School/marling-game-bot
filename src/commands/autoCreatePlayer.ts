import { Message } from "discord.js";

import { IPlayerDoc, Player } from "../db/model/player";

const INITIAL_HEALTH = 100;

const autoCreatePlayer = async (msg: Message) => {
    // Find the player in the database
    const player: IPlayerDoc | null = await Player.findById(msg.author.id);
    if (!player) {
        const created = new Player({ _id: msg.author.id, name: msg.author.username, health: INITIAL_HEALTH, xp: 0 });
        await created.save();
        msg.channel.send(`Player Created for ${msg.author.username}`);
    }
}


export default autoCreatePlayer;