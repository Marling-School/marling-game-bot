import {Command} from "./types";
import {MessageEmbed} from "discord.js";
import commands from ".";

const help: Command = {
    description: "Lists all commands",
    aliases: ["help"],
    run: (msg) => {
        const embed = new MessageEmbed()
            .setTitle("Marling Game Bot Help Message")
            .setColor('#0099ff')

        commands.forEach(command => {
            const aliases = command.aliases.toString().replace(",", ", ")
            embed.addField(aliases, command.description)
        })

        msg.channel.send(embed)
    }
}

export default help