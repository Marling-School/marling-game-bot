import draw from './draw';
import fightMonster from './fightMonster';
import guessNumber from './guessNumber';
import addition from './addition';
import profile from './profile';
import { Command } from './types';
import { MessageEmbed } from 'discord.js';


const commands: Command[] = [
    draw, profile, addition, fightMonster, guessNumber
];

const help: MessageEmbed = new MessageEmbed()
    .setTitle("Marling Game Bot Help Message")
    .setColor('#0099ff')

commands.forEach(command => {
    const aliases = command.aliases.toString().replace(",", ", ")
    help.addField(aliases, command.description)
})

export default commands;

export { help };