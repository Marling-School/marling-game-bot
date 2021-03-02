import NumberBase from "./NumberBase";

export default class BaseConversion {
    playerDigits: string[];
    correctDigits: string[];

    constructor(from: NumberBase, to: NumberBase) {
        let numberToConvert = 255 * Math.random();


        this.playerDigits = [];
        this.correctDigits = [];
    }

    isFinished() {


    }
}