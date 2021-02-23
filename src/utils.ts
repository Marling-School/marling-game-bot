export function choose<T>(arr: T[]): T {
    if (arr.length === 0) {
        throw new Error('Empty array, cannot choose')
    }

    return arr[Math.floor(Math.random() * arr.length)];
}

export function takeChance(probability: number) {
    return Math.random() < probability;
}