export default class NumberBase {
    name: string;
    symbols: string[];
    emojis: string[];
    padding: number;

    constructor(name: string, symbols: string[], emojis: string[], padding: number = 0) {
        this.name = name;
        this.symbols = symbols;
        this.emojis = emojis;
        this.padding = padding;
    }

    toString(value: number): string[] {
        const digits: string[] = [];

        // Successive division, using remainder to figure out next digit
        // Works out from LSD to MSD
        let divValue = value;
        while (divValue > 0) {
            const remainder = divValue % this.symbols.length;
            digits.unshift(this.symbols[remainder]);
            divValue = Math.floor(divValue / this.symbols.length);
        }

        // Add any required padding
        while (digits.length < this.padding) {
            digits.unshift(this.symbols[0]);
        }

        return digits;
    }

    fromString(asString: string): number {
        let value = 0;

        let placeValue = 1;
        Array.from(asString).reverse().forEach(digit => {
            const indexOf = this.symbols.indexOf(digit);
            value += indexOf * placeValue;
            placeValue *= this.symbols.length;
        })

        return value;
    }
}

export const binary: NumberBase = new NumberBase(
    'Binary',
    ['0', '1'],
    ['0️⃣', '1️⃣'],
    8);
export const denary: NumberBase = new NumberBase(
    'Denary',
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'],
    0);
export const hexadecimal: NumberBase = new NumberBase(
    'Hexadecimal',
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
    ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🇦', '🇧', '🇨', '🇩', '🇪', '🇫'],
    2);
