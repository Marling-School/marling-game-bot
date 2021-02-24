import Discord from "discord.js";
import { IPlayerDoc } from "../db/model/player";

export interface Command {
    aliases: string[]
    description: string
    run: (player: IPlayerDoc, msg: Discord.Message, content: string, splitOnSpace: string[]) => void
}

export type Optional<T> = T | undefined;