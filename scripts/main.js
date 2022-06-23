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
let currentPieceIsFalling = true;

//helper functions
/*his function converts the array of div elements into two-dimensional array.
This will make working with the board easier in the future
*/
function convertBoard() {
    const board = document.getElementsByClassName('block');
    const twoDimensionalBoard = [
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
            twoDimensionalBoard[i][x] = board[counter];
            counter++;
        }
    }

    return twoDimensionalBoard;
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
    let row = 0;
    let column = 0;

    for (let i = 0; i <= 1; i++) {
        column = 0;
        for (let x = 3; x <= 6; x++) {
            PIECES[i][x] = shape[row][column] === 1 ? piece.color : 0;
            shape[row][column] === 1 ? currentPiece.push(new Coordinate(i, x)) : null;
            column++;
        }
        row++;
    }

}

function fallingCurrentPiece() {
    //gets the color of the current piece.
    let currentPlaceColorValue = PIECES[currentPiece[0].x][currentPiece[0].y];

    currentPieceIsFalling = currentPiece.findIndex((e) => e.x === 19) === -1;

    if (currentPieceIsFalling) {
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

}

function playTetris() {
    generateNewPiece();

    setInterval(() => {
        fallingCurrentPiece();
        synchronizePiecesWithBoard();
    }, 1000);
}

//game process
playTetris();