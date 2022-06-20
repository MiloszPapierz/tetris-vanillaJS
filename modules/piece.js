export class Piece {
    //all possible colors
    static #colors = ['#f6921e','#00adee','#ec1b24','#fff21c','#ec008b','#8ac43e','#ffc000'];
    //1 -> block; 0-> empty;
    static #shapes = [[[1,1,1,1],[0,0,0,0]],[[1,1,1,1],[0,0,0,1]],[[1,1,1,1],[1,0,0,0]],[[0,1,1,0],[0,1,1,0]],[[0,1,1,0],[1,1,0,0]],[[0,1,1,1],[0,0,1,0]],[[1,1,0,0],[0,1,1,0]]];
    #shape;
    #color;

    constructor() {
        let randomNumber = Math.floor(Math.random() * Piece.#colors.length);
        this.#color = Piece.#colors[randomNumber];
        this.#shape = Piece.#shapes[randomNumber];
    }

    get shape() {
        return this.#shape;
    }

    get color() {
        return this.#color;
    }
}