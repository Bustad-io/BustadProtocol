export function randomCadastralNumber() {
    return `${getRandomInt(0, 101)}/${getRandomInt(0, 11)}/${getRandomInt(0, 11)}/${getRandomInt(0, 11)}`
}

/**
 * The maximum is exclusive and the minimum is inclusive
 * @param min 
 * @param max 
 * @returns random number
 */
export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

export function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

