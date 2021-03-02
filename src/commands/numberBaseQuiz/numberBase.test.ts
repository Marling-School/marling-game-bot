import { binary, denary, hexadecimal } from './NumberBase';

interface TestCase {
    value: number;
    asBinary: string[];
    asDenary: string[];
    asHexadecimal: string[];
}

const testCases: TestCase[] = [
    {
        value: 1,
        asBinary: ['0', '0', '0', '0', '0', '0', '0', '1'],
        asDenary: ['1'],
        asHexadecimal: ['0', '1']
    },
    {
        value: 4,
        asBinary: ['0', '0', '0', '0', '0', '1', '0', '0'],
        asDenary: ['4'],
        asHexadecimal: ['0', '4']
    },
    {
        value: 9,
        asBinary: ['0', '0', '0', '0', '1', '0', '0', '1'],
        asDenary: ['9'],
        asHexadecimal: ['0', '9']
    },
    {
        value: 12,
        asBinary: ['0', '0', '0', '0', '1', '1', '0', '0'],
        asDenary: ['1', '2'],
        asHexadecimal: ['0', 'C']
    },
    {
        value: 14,
        asBinary: ['0', '0', '0', '0', '1', '1', '1', '0'],
        asDenary: ['1', '4'],
        asHexadecimal: ['0', 'E']
    },
    {
        value: 23,
        asBinary: ['0', '0', '0', '1', '0', '1', '1', '1'],
        asDenary: ['2', '3'],
        asHexadecimal: ['1', '7']
    },
    {
        value: 34,
        asBinary: ['0', '0', '1', '0', '0', '0', '1', '0'],
        asDenary: ['3', '4'],
        asHexadecimal: ['2', '2']
    },
    {
        value: 129,
        asBinary: ['1', '0', '0', '0', '0', '0', '0', '1'],
        asDenary: ['1', '2', '9'],
        asHexadecimal: ['8', '1']
    },
    {
        value: 167,
        asBinary: ['1', '0', '1', '0', '0', '1', '1', '1'],
        asDenary: ['1', '6', '7'],
        asHexadecimal: ['A', '7']
    },
    {
        value: 230,
        asBinary: ['1', '1', '1', '0', '0', '1', '1', '0'],
        asDenary: ['2', '3', '0'],
        asHexadecimal: ['E', '6']
    }
]

testCases.forEach(({ value, asBinary, asDenary, asHexadecimal }) => {
    test(`Number Bases - Binary of ${value} should be ${asBinary.join('')}`, () => {
        expect(binary.toString(value)).toEqual(asBinary);
        expect(binary.fromString(asBinary.join(''))).toBe(value);
    });
    test(`Number Bases - Denary of ${value} should be ${asDenary.join('')}`, () => {
        expect(denary.toString(value)).toEqual(asDenary);
        expect(denary.fromString(asDenary.join(''))).toBe(value);
    });
    test(`Number Bases - Hex of ${value} should be 0x${asHexadecimal.join('')}`, () => {
        expect(hexadecimal.toString(value)).toEqual(asHexadecimal);
        expect(hexadecimal.fromString(asHexadecimal.join(''))).toBe(value);
    });
});

