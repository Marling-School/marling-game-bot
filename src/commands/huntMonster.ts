import { Message } from "discord.js";
import { MessageHandler } from "./types";

import { IPlayerDoc, Player } from "../db/model/player";

const huntMonster: MessageHandler = async (msg: Message, content: string, splitOnSpace: string[]) => {
    const player: IPlayerDoc | null = await Player.findById(msg.author.id);

    if (!player) {
        msg.channel.send('Player Not Found');
        return;
    }

    player.health -= 10;
    player.xp += 10;
    player.save();

    msg.channel.send('Monster Hunted ' + JSON.stringify(player, null, 2));
}


export default huntMonster;