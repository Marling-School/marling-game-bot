import Discord from "discord.js";

export type MessageHandler = (msg: Discord.Message, content: string, splitOnSpace: string[]) => void;
export interface MessageHandlers {
    [s: string]: MessageHandler;
}