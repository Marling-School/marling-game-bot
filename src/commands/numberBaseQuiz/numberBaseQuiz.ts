import { Message } from "discord.js";
import { IPlayerDoc } from "../../db/model/player";
import { Command } from "../types";



const numberBaseQuiz: Command = {
    aliases: ['numberBaseQuiz', 'num'],
    description: 'Answer a series of questions about number bases, test your knowledge of binary & hexadecimal',
    run: async (firstPlayer: IPlayerDoc, msg: Message, content: string, splitOnSpace: string[]) => {

    }
}

export default numberBaseQuiz;

