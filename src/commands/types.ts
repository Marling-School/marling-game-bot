import Discord from "discord.js";

export interface Command {
    aliases: string[]
    description: string
    run: (msg: Discord.Message, content: string, splitOnSpace: string[]) => void
}

export type Commands = Command[]

export type Optional<T> = T | undefined;