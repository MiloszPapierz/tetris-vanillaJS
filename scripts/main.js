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

function xPivot(pivot, yCell) {
    return pivot.y - yCell + pivot.x;
}

function yPivot(pivot, xCell) {
    return pivot.y - pivot.x + xCell;
}

function updatePiecesColor(color) {
    currentPiece.forEach((coordinate) => {
        PIECES[coordinate.y][coordinate.x] = color;
    });
}

function moveCoordinatesToRight() {
    currentPiece.forEach((coordinate) => {
        coordinate.x += 1;
    })
}

function moveCoordinatesToLeft() {
    currentPiece.forEach((coordinate) => {
        coordinate.x -= 1;
    })
}

function moveCoordinatesDown() {
    currentPiece.forEach((coordinate) => {
        coordinate.y += 1;
    })
}

function findLastRow() {
    const rows = currentPiece.map(c => c.y);

    return Math.max(...rows);
}

function checkFallingCurrentPiece() {
    const index = currentPiece.findIndex((e) => e.y === 19);

    if (index !== -1) {
        return false;
    } else {
        const lastRow = findLastRow();
        for (let i = 0; i < currentPiece.length; i++) {
            if (currentPiece[i].y === lastRow) {
                if (PIECES[currentPiece[i].y+1][currentPiece[i].x] !== 0) {
                    return false;
                }
            }
        }
    }

    return true;
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

    currentPiece = [];

    for (let i = 0; i <= 1; i++) {
        column = 0;
        for (let x = 3; x <= 6; x++) {
            PIECES[i][x] = shape[row][column] === 1 ? piece.color : 0;
            shape[row][column] === 1 ? currentPiece.push(new Coordinate(x, i)) : null;
            column++;
        }
        row++;
    }
}

function fallingCurrentPiece(direction) {
    //gets the color of the current piece.
    const currentPlaceColorValue = PIECES[currentPiece[0].y][currentPiece[0].x];

    //currentPieceIsFalling = currentPiece.findIndex((e) => e.y === 19) === -1;
    currentPieceIsFalling = checkFallingCurrentPiece();

    const canGoRight = currentPiece.findIndex((e) => e.x === 9) === -1;
    const canGoLeft = currentPiece.findIndex((e) => e.x === 0) === -1;

    if (currentPieceIsFalling) {
        //changing old positions to 0 and updating the coordinate. 0 -> there is no piece on that position.
        currentPiece.forEach((coordinate) => {
            PIECES[coordinate.y][coordinate.x] = 0;
            if (direction === 'd') {
                coordinate.y = coordinate.y + 1;
            } else if (canGoLeft && direction === 'l') {
                coordinate.x = coordinate.x - 1;
            } else if (canGoRight && direction === 'r') {
                coordinate.x = coordinate.x + 1;
            }
        })

        //updating the color of current position
        updatePiecesColor(currentPlaceColorValue);
    }

    synchronizePiecesWithBoard();
}

function rotate() {
    //if not square. Square doesn't need to be rotated
    if (PIECES[currentPiece[0].y][currentPiece[0].x] != '#fff21c' && currentPieceIsFalling) {
        const color = PIECES[currentPiece[0].y][currentPiece[0].x];
        let pivot;
        if (color == "#f6921e" || color == "#ec1b24" || color == "#8ac43e") {
            pivot = currentPiece[1];
        } else if (color == "#00adee" || color == "#ffc000") {
            pivot = currentPiece[2];
        } else if (color == "#ec008b") {
            pivot = currentPiece[3];
        }

        for (let i = 0; i < currentPiece.length; i++) {
            PIECES[currentPiece[i].y][currentPiece[i].x] = 0;
            let newX = xPivot(pivot, currentPiece[i].y);
            let newY = yPivot(pivot, currentPiece[i].x);

            [currentPiece[i].x, currentPiece[i].y] = [newX, newY];
        }

        //left and right walls
        currentPiece.findIndex((coordinate) => coordinate.x < 0) !== -1 ? moveCoordinatesToRight() : null;
        currentPiece.findIndex((coordinate) => coordinate.x > 9) !== -1 ? moveCoordinatesToLeft() : null;

        //top wall
        currentPiece.findIndex((coordinate) => coordinate.y < 0) !== -1 ? moveCoordinatesDown() : null;

        updatePiecesColor(color);
        synchronizePiecesWithBoard();
    }
}

function playTetris() {
    generateNewPiece();
    window.addEventListener('keydown', (event) => {
        switch (event.keyCode) {
            case 37:
                fallingCurrentPiece('l');
                break;
            case 40:
                fallingCurrentPiece('d');
                break;
            case 39:
                fallingCurrentPiece('r');
                break;
            case 38:
                rotate();
                break;
        }
    });

    setInterval(() => {
        fallingCurrentPiece('d');
        if (!currentPieceIsFalling) {
            currentPieceIsFalling = true;
            generateNewPiece();
        }
    }, 1000);
}

//game process
playTetris();