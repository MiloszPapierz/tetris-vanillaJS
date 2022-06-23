import {Piece} from '../modules/piece.js';
import {Coordinate} from "../modules/coordinate.js";

//global variables and constants
const PIECES = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
const BOARD = convertBoard();
let currentPiece = [];

//helper functions
/*his function covnerts the array of div elements into two dimensional array.
This will make working with the board easier in the future
*/
function convertBoard() {
    const board = document.getElementsByClassName('block');
    const twoDimenstionalBoard = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
    ];
    let counter = 0;

    for (let i = 0; i < 20; i++) {
        for (let x = 0; x < 10; x++) {
            twoDimenstionalBoard[i][x] = board[counter];
            counter++;
        }
    }

    return twoDimenstionalBoard;
}

//game functions
function generateNewPiece() {
    const piece = new Piece()
    addNewShapeToBoard(piece);
    synchronizePiecesWithBoard();
}

function synchronizePiecesWithBoard() {
    for (let i = 0; i < 20; i++) {
        for (let x = 0; x < 10; x++) {
            if (PIECES[i][x] !== 0) {
                BOARD[i][x].style.backgroundColor = PIECES[i][x].toString();
            } else {
                BOARD[i][x].style.backgroundColor = "#15181d";
            }
        }
    }
}

function addNewShapeToBoard(piece) {
    const shape = piece.shape;
    let rij = 0;
    let kolom = 0;

    for (let i = 0; i <= 1; i++) {
        kolom = 0;
        for (let x = 3; x <= 6; x++) {
            PIECES[i][x] = shape[rij][kolom] === 1 ? piece.color : 0;
            shape[rij][kolom] === 1 ? currentPiece.push(new Coordinate(i, x)) : null;
            kolom++;
        }
        rij++;
    }

}

function fallingCurrentPiece() {
    //gets the color of the current piece.
    let currentPlaceColorValue = PIECES[currentPiece[0].x][currentPiece[0].y];

    //changing old positions to 0 and updating the coordinate. 0 -> there is no piece on that position.
    currentPiece.forEach((coordinate) => {
        PIECES[coordinate.x][coordinate.y] = 0;
        coordinate.x = coordinate.x + 1;
    })

    //updating the color of current position
    currentPiece.forEach((coordinate) => {
        PIECES[coordinate.x][coordinate.y] = currentPlaceColorValue;
    });
}

function playTetris() {
    generateNewPiece();

    setInterval(() => {
        fallingCurrentPiece();
        synchronizePiecesWithBoard();
    }, 1500);
}

//game process
playTetris();