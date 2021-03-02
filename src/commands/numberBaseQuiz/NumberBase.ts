export default class NumberBase {
    symbols: string[];
    padding: number;

    constructor(symbols: string[], padding: number = 0) {
        this.symbols = symbols;
        this.padding = padding;
    }

    toString(value: number): string[] {
        let digits: string[] = [];

        // Successive division, using remainder to figure out next digit
        // Works out from LSD to MSD
        let divValue = value;
        while (divValue > 0) {
            let remainder = divValue % this.symbols.length;
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
            let indexOf = this.symbols.indexOf(digit);
            value += indexOf * placeValue;
            placeValue *= this.symbols.length;
        })

        return value;
    }
}

export const binary: NumberBase = new NumberBase(['0', '1'], 8);
export const denary: NumberBase = new NumberBase(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], 0);
export const hexadecimal: NumberBase = new NumberBase(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'], 2);
