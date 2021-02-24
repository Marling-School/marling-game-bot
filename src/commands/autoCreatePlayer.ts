import { Message } from "discord.js";

import { IPlayerDoc, Player } from "../db/model/player";

const INITIAL_HEALTH = 100;

const autoCreatePlayer = async (msg: Message): Promise<IPlayerDoc> => {
    // Find the player in the database
    let player: IPlayerDoc | null = await Player.findById(msg.author.id);
    if (!player) {
        player = new Player({ _id: msg.author.id, name: msg.author.username, health: INITIAL_HEALTH, xp: 0 });
        await player.save();
        await msg.channel.send(`Player Created for ${msg.author.username}`);
    }
    return player;
}


export default autoCreatePlayer;