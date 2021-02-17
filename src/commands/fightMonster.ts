import { Message } from "discord.js";
import { MessageHandler } from "./types";

import { IPlayerDoc, Player } from "../db/model/player";

const fightMonster: MessageHandler = async (msg: Message, content: string, splitOnSpace: string[]) => {
    // Find the player in the database
    const player: IPlayerDoc | null = await Player.findById(msg.author.id);
    if (!player) {
        msg.channel.send('Player Not Found');
        return;
    }

    // Create a message collector for the fight
    const filter = (m: Message) => m.channel.id === msg.channel.id && m.author.id === msg.author.id;
    const collector = msg.channel.createMessageCollector(filter, { time: 60000 });

    let monsterHealth = 5;

    collector.on('collect', (m: Message) => {
        switch (m.content) {
            case 'strike':
                monsterHealth -= 1;
                break;
            case 'block':
                break;
            case 'backAway':
                break;
            case 'closeIn':
                break;
        }

        if (Math.random() < 0.5) {
            player.health -= 1;
            m.channel.send(`${player.name} took damage!`)
        }

        if (player.health <= 0) {
            m.channel.send(`${player.name} was killed by the monster!`)
            player.health = 20; // Reset to a low amount (respawn)
            collector.stop();
        } else if (monsterHealth <= 0) {
            m.channel.send(`${player.name} Killed the Monster!`)
            player.xp += 100;
            collector.stop();
        } else {
            msg.channel.send(`Fight Over, ${player.name}: ${player.health}, Monster: ${monsterHealth}`);
        }

        return true;
    });
    collector.on('end', collected => {
        msg.channel.send(`Fight Over, Player: ${player.name}: ${player.health}, XP:${player.xp}, Monster: ${monsterHealth}`);

        player.save();
    });

    msg.channel.send(`Player ${msg.author.username} is fighting a monster!`)
}

export default fightMonster;