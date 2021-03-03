import { MessageEmbed } from "discord.js";
import { NumberBase } from "comp-sci-maths-lib";

export default class BaseConversion {
    value: number;
    from: NumberBase;
    to: NumberBase;
    presentedDigits: string[];
    playerDigits: string[];
    correctDigits: string[];

    constructor(maxValue: number, from: NumberBase, to: NumberBase) {
        this.value = Math.floor(maxValue * Math.random());

        this.from = from;
        this.to = to;
        this.presentedDigits = from.toDigits(this.value);
        this.playerDigits = [];
        this.correctDigits = to.toDigits(this.value);
    }

    enterDigit(reactionEmoji: string) {
        const indexOf = this.to.emojis.indexOf(reactionEmoji);
        this.playerDigits.unshift(this.to.symbols[indexOf]);
    }

    generateEmbed(): MessageEmbed {
        const embed = new MessageEmbed()
            .setColor(this.isFinished() ? (this.isCorrect() ? 'green' : 'red') : 'blue')
            .setDescription(`Convert ${this.from.name} ${this.presentedDigits.join('')} to ${this.to.name}`)
            .addField("Your Answer", `=${this.playerDigits.join('').padStart(this.to.padding, '-')}`)
            .setFooter('Use Reactions to select digits, starting from LSD and working up');

        return embed;
    }

    isCorrect() {
        if (this.playerDigits.length !== this.correctDigits.length) {
            return false;
        }

        const incorrectDigits = this.playerDigits.filter((p, i) => p !== this.correctDigits[i]);

        return incorrectDigits.length === 0;
    }

    isFinished() {
        return this.playerDigits.length === this.correctDigits.length;
    }
}