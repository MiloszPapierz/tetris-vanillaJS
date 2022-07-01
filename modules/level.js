export class Level {
    static #speedTable = [960,860,760,660,560,460,360,260,160,120,100,100,100,80,80,80];
    #currentLevel;
    #numberOfLines;

    constructor() {
        this.#currentLevel = 0;
        this.#numberOfLines = 0;
    }

    get currentLevel() {
        return this.#currentLevel;
    }

    get speed() {
        return Level.#speedTable[this.#currentLevel];
    }

    increaseTotalLines() {
        this.#numberOfLines += 1;
        if(this.#numberOfLines % 10 === 0 && this.#currentLevel < 15) {
            this.#currentLevel += 1;
        }
    }
}
