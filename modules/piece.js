import {Coordinate} from "./coordinate.js";

export class Piece {
    //all possible colors
    static #colors = ['#f6921e','#00adee','#ec1b24','#fff21c','#ec008b','#8ac43e','#ffc000'];
    static #shapes = [[new Coordinate(3,0),new Coordinate(4,0),new Coordinate(5,0),new Coordinate(6,0)],[new Coordinate(3,0),new Coordinate(4,0),new Coordinate(5,0),new Coordinate(5,1)],[new Coordinate(3,0),new Coordinate(4,0),new Coordinate(5,0),new Coordinate(3,1)],[new Coordinate(4,0),new Coordinate(5,0),new Coordinate(4,1),new Coordinate(5,1)],[new Coordinate(4,0),new Coordinate(5,0),new Coordinate(3,1),new Coordinate(4,1)],[new Coordinate(3,0),new Coordinate(4,0),new Coordinate(5,0),new Coordinate(4,1)],[new Coordinate(3,0),new Coordinate(4,0),new Coordinate(4,1),new Coordinate(5,1)]];
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