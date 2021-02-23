
import { v4 as uuidv4 } from 'uuid';
import { Message } from 'discord.js';

export default class BotEnabled {
    startTime: Date = new Date();
    enabled: boolean = true;
    uniqueId = uuidv4();

    isEnabled(msg: Message, content: string, parts: string[]): boolean {
        if (parts[0] !== 'BotEnabled') {
            return this.enabled;
        }

        if (parts.length < 2) {
            msg.channel.send('Not enough parts to message');
        }

        switch (parts[1]) {
            case 'Toggle': {
                if (parts.length !== 3) {
                    msg.channel.send('To toggle, you need to enter "BotEnabled Toggle <uuid>"');
                    return this.enabled;
                }
                if (parts[2] === this.uniqueId) {
                    this.enabled = !this.enabled;
                    msg.channel.send(`Bot ${this.uniqueId} is now ${this.enabled ? 'Enabled' : 'Disabled'}`)

                    // Return false, since we don't need to contine processig this command
                    return !this.enabled;
                }
                break;
            }
            case 'Display': {
                msg.channel.send(`This bots unique ID is ${this.uniqueId}, started at ${this.startTime}`)
                break;
            }
        }

        return this.enabled;
    }
}