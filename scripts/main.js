import {Piece} from '../modules/piece.js';
import {Coordinate} from "../modules/coordinate.js";
import {Level} from "../modules/level.js";

//global variables and constants
const PIECES = Array(20).fill(0).map(() => Array(10).fill(0));
const BOARD = convertBoard(20, 10, 'block');
const NEXT_PIECE_BOARD = convertBoard(3, 4, 'next-piece-block');
let eventListeners;
let currentPiece = [];
let currentPieceIsFalling = true;
let hardDropCoordinates = [];
let pieces = [new Piece(), new Piece()];
const SCORE_ELEMENT = document.getElementById("score");
let score = 0
const level = new Level();
let interval;
const END_GAME_ELEMENT = document.getElementById("end-game-element");
const END_GAME_BUTTON = document.getElementById("play-again");
let isGameOver = false;
const highestScore = window.localStorage.getItem("score") === null ? null : window.localStorage.getItem("score");
const HIGHEST_SCORE_ELEMENT = document.getElementById("highest-score");
//helper functions
/*his function converts the array of div elements into two-dimensional array.
This will make working with the board easier in the future
*/
function convertBoard(rowCount, columnCount, elements) {
    const board = document.getElementsByClassName(elements);
    const twoDimensionalBoard = Array(rowCount).fill(0).map(() => Array(columnCount).fill(0));
    let counter = 0;

    for (let i = 0; i < rowCount; i++) {
        for (let x = 0; x < columnCount; x++) {
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

//Sets the color of the current piece on the board
function updatePiecesColor(color) {
    currentPiece.forEach((coordinate) => {
        PIECES[coordinate.y][coordinate.x] = color;
    });
}

function moveCurrentPieceToRight() {
    currentPiece.forEach((coordinate) => {
        coordinate.x += 1;
    })
}

function moveCurrentPieceToLeft() {
    currentPiece.forEach((coordinate) => {
        coordinate.x -= 1;
    })
}

//Moves the given coordinates down by one
function moveCoordinatesDown(coordinatesToMove) {
    coordinatesToMove.forEach((coordinate) => {
        coordinate.y += 1;
    })
}

function moveCurrentPieceUp() {
    currentPiece.forEach((coordinate) => {
        coordinate.y = coordinate.y - 1;
    });
}

//Checks if the given piece(tetromino) can go down by one. It returns a boolean
function checkFallingPiece(piece) {
    const index = piece.findIndex((e) => e.y === 19);

    if (index !== -1) {
        return false;
    } else {
        for (let i = 0; i < piece.length; i++) {
            if (PIECES[piece[i].y + 1][piece[i].x] !== 0) {
                if (!piece.some((coordinate) => coordinate.y === piece[i].y + 1 && coordinate.x === piece[i].x)) {
                    return false;
                }
            }
        }
    }

    return true;
}

//Checks if currentPiece can go one coordinate to the left
function checkGoLeft() {
    if (currentPiece.findIndex((e) => e.x === 0) === -1) {
        for (let i = 0; i < currentPiece.length; i++) {
            if (PIECES[currentPiece[i].y][currentPiece[i].x - 1] !== 0) {
                if (!currentPiece.some((coordinate) => coordinate.y === currentPiece[i].y && coordinate.x === currentPiece[i].x - 1)) {
                    return false;
                }
            }
        }
        return true;
    }

    return false;
}

//Checks if currentPiece can go one coordinate to the right
function checkGoRight() {
    if (currentPiece.findIndex((e) => e.x === 9) === -1) {
        for (let i = 0; i < currentPiece.length; i++) {
            if (PIECES[currentPiece[i].y][currentPiece[i].x + 1] !== 0) {
                if (!currentPiece.some((coordinate) => coordinate.y === currentPiece[i].y && coordinate.x === currentPiece[i].x + 1)) {
                    return false;
                }
            }
        }
        return true;
    }

    return false;
}

//Sets the coordinates on board to 0. 0-> there is no block on this position. It is used to clear the board of the old position of a tetromino(after it changed position)
function clearCurrentPieceOnBoard() {
    currentPiece.forEach((coordinate) => {
        //changing old positions to 0. 0 -> there is no piece on that position.
        PIECES[coordinate.y][coordinate.x] = 0;
    })
}

//game functions
function generateNewPiece() {
    addShapeToNextBoard(pieces[pieces.length - 1]);
    const piecesEl = pieces.splice(0, 1)[0];
    addNewShapeToBoard(piecesEl);
    synchronizePiecesWithBoard();
    pieces.push(new Piece());
    determineHardDropCoordinates();
    setHardDropCoordinateColors(piecesEl.color);
}

function addShapeToNextBoard(piece) {
    //first we need to clear the old board
    for(let i=0;i<NEXT_PIECE_BOARD.length;i++) {
        for(let x=0;x<NEXT_PIECE_BOARD[i].length;x++) {
            NEXT_PIECE_BOARD[i][x].style.backgroundColor = "#15181d";
        }
    }
    const color = piece.color;
    piece.shape.forEach((coordinate) => {
       NEXT_PIECE_BOARD[coordinate.y+1][coordinate.x-3].style.backgroundColor = color;
    });
}

//Used to synchronize PIECES(backend) with BOARD(frontend)
function synchronizePiecesWithBoard() {
    for (let i = 0; i < 20; i++) {
        for (let x = 0; x < 10; x++) {
            if (PIECES[i][x] !== 0) {
                BOARD[i][x].style.backgroundColor = PIECES[i][x];
            } else {
                BOARD[i][x].style.backgroundColor = "#15181d";
            }
        }
    }
}

function addNewShapeToBoard(pieceEl) {
    const shape = pieceEl.shape;
    const color = pieceEl.color;

    shape.forEach((coordinate) => {
        PIECES[coordinate.y][coordinate.x] = color;
    });

    currentPiece = JSON.parse(JSON.stringify(shape)).map((c) => new Coordinate(c.x, c.y));

    //checks if moving currentPiece down by one wouldn't end the game. If so set isGameOver to true.
    moveCoordinatesDown(currentPiece);
    if (!checkFallingPiece(currentPiece)) {
        isGameOver = true;
    }

    //moves currentPiece back to the starting position
    moveCurrentPieceUp();
}

function pieceMovement(direction) {
    currentPieceIsFalling = checkFallingPiece(currentPiece);

    if (currentPieceIsFalling) {
        //gets the color of the current piece.
        const currentPlaceColorValue = PIECES[currentPiece[0].y][currentPiece[0].x];
        const canGoRight = checkGoRight();
        const canGoLeft = checkGoLeft();

        //this check has to happen before clearing old coordinates because of the implementation of rotate function
        if (direction === 'u') {
            rotate();
        }

        //clear old coordinates
        clearCurrentPieceOnBoard();

        if (direction === 'd') {
            moveCoordinatesDown(currentPiece);
        } else if (canGoLeft && direction === 'l') {
            moveCurrentPieceToLeft();
        } else if (canGoRight && direction === 'r') {
            moveCurrentPieceToRight();
        }

        //after movement clear old hard drop coordinates,calculate new ones and set them.
        clearHardDropCoordinateColors();
        determineHardDropCoordinates();
        setHardDropCoordinateColors(currentPlaceColorValue);

        //updating the color of current position
        updatePiecesColor(currentPlaceColorValue);
    }

    synchronizePiecesWithBoard();
}

function determineHardDropCoordinates() {
    /*This has to be cloned like that.Spread operator doesn't work because there are nested objects
    * https://stackoverflow.com/questions/59665766/array-still-following-reference-somehow-even-though-ive-passed-another-referenc
    * map used to convert object literals to ES6 class objects
    * */
    const copyOfCoordinates = JSON.parse(JSON.stringify(currentPiece)).map((c) => new Coordinate(c.x, c.y));

    while (checkFallingPiece(copyOfCoordinates)) {
        moveCoordinatesDown(copyOfCoordinates);
    }

    hardDropCoordinates = [...copyOfCoordinates];
}

//Places a border color on the board for hard drop coordinates
function setHardDropCoordinateColors(color) {
    hardDropCoordinates.forEach((coordinate) => {
        BOARD[coordinate.y][coordinate.x].style.border = `1px solid ${currentPiece.some((c) => c.y === coordinate.y && c.x === coordinate.x) ? "#174151" : color}`;
    })
}

//Sets normal border color for hard drop coordinates(before calculating new coordinates)
function clearHardDropCoordinateColors() {
    hardDropCoordinates.forEach((coordinate) => {
        BOARD[coordinate.y][coordinate.x].style.border = "1px solid #174151";

    })
}

function hardDrop() {
    const maxRowNumber = hardDropCoordinates[0].y;
    const minRowNumber = currentPiece[0].y;
    const color = PIECES[currentPiece[0].y][currentPiece[0].x];
    clearCurrentPieceOnBoard();
    currentPiece = [...hardDropCoordinates];
    updatePiecesColor(color);
    synchronizePiecesWithBoard();
    clearHardDropCoordinateColors();
    currentPieceIsFalling = false;
    score += (maxRowNumber - minRowNumber) * 2;
    SCORE_ELEMENT.innerText = score;
}

//moves all rows down by one. It is used after removing a full row
function moveAllBlocksDown(fullRows) {
    let old = [...PIECES];
    PIECES[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 1; i <= Math.max(...fullRows); i++) {
        PIECES[i] = old[i - 1];
    }

}

function changeScore(rowNumbers) {
    if (rowNumbers === 1) {
        score += 40 * (level.currentLevel + 1);
    } else if (rowNumbers === 2) {
        score += 100 * (level.currentLevel + 1);
    } else if (rowNumbers === 3) {
        score += 300 * (level.currentLevel + 1);
    } else {
        score += 400 * (level.currentLevel + 1);
    }

    SCORE_ELEMENT.innerText = score;
}

function checkFullRow() {
    let totalRow = 0;
    const fullRows = [];

    for (let row = 19; row > 0; row--) {
        for (let column = 0; column < 10; column++) {
            if (PIECES[row][column] !== 0) {
                totalRow++;
            }
        }
        if (totalRow === 10) {
            fullRows.push(row);
        }

        totalRow = 0;
    }

    if (fullRows.length !== 0) {
        changeScore(fullRows.length);
        for (let i = 0; i < fullRows.length; i++) {
            moveAllBlocksDown(fullRows);
            level.increaseTotalLines();
        }

        //if min 1 row was full remove the timer and sets new one because there could be a new timer speed
        clearInterval(interval);
        interval = setInterval(gameProcess, level.speed);
        synchronizePiecesWithBoard();
    }

}

function rotate() {
    //if not square. Square doesn't need to be rotated
    const color = PIECES[currentPiece[0].y][currentPiece[0].x];
    if (color !== '#fff21c' && currentPieceIsFalling) {
        //determines the block that will be used to rotate other blocks.
        let pivot;
        if (color == "#f6921e" || color == "#ec1b24" || color == "#8ac43e") {
            pivot = currentPiece[1];
        } else if (color == "#00adee" || color == "#ffc000") {
            pivot = currentPiece[2];
        } else if (color == "#ec008b") {
            pivot = currentPiece[3];
        }
        /*This has to be cloned like that.Spread operator doesn't work because there are nested objects
        * https://stackoverflow.com/questions/59665766/array-still-following-reference-somehow-even-though-ive-passed-another-referenc
        * .map used to convert object literals to ES6 class objects
        * */
        const coordinatesBeforeRotation = JSON.parse(JSON.stringify(currentPiece)).map((c) => new Coordinate(c.x, c.y));

        for (let i = 0; i < currentPiece.length; i++) {
            PIECES[currentPiece[i].y][currentPiece[i].x] = 0;
            let newX = xPivot(pivot, currentPiece[i].y);
            let newY = yPivot(pivot, currentPiece[i].x);

            [currentPiece[i].x, currentPiece[i].y] = [newX, newY];
        }

        //wall kicks
        //top wall
        if (currentPiece.findIndex((coordinate) => coordinate.y < 0) !== -1) {
            do {
                moveCoordinatesDown(currentPiece);
            } while (currentPiece.some((coordinate) => coordinate.y < 0))
        }
        //left wall
        if (currentPiece.findIndex((coordinate) => coordinate.x < 0) !== -1) {
            do {
                moveCurrentPieceToRight();
            } while (currentPiece.some((coordinate) => coordinate.x < 0));
        }
        //right wall
        if (currentPiece.findIndex((coordinate) => coordinate.x > 9) !== -1) {
            do {
                moveCurrentPieceToLeft();
            } while (currentPiece.some((coordinate) => coordinate.x > 9));
        }
        //bottom wall
        if (currentPiece.findIndex((coordinate) => coordinate.y > 19) !== -1) {
            do {
                moveCurrentPieceUp();
            } while (currentPiece.some((coordinate) => coordinate.y > 19));
        }

        //check if the piece after rotation collapse with another. If so don't rotate and go back to coordinate before rotation.
        if (currentPiece.some((coordinate) => PIECES[coordinate.y][coordinate.x] !== 0)) {
            currentPiece = [...coordinatesBeforeRotation];
        }

        updatePiecesColor(color);
        synchronizePiecesWithBoard();
    }
}

function gameProcess() {
    if (isGameOver) {
        clearInterval(interval);
        END_GAME_ELEMENT.style.display = "block";
        highestScore < score ? window.localStorage.setItem("score",score) : null;
        window.removeEventListener("keydown", eventListeners);
    } else {
        pieceMovement('d');
        if (!currentPieceIsFalling) {
            checkFullRow();
            currentPieceIsFalling = true;
            generateNewPiece();
        }
    }
}

function playTetris() {
    generateNewPiece();
    HIGHEST_SCORE_ELEMENT.innerText = highestScore === null ? 0 : highestScore;
    window.addEventListener('keydown', eventListeners = (event) => {
        switch (event.keyCode) {
            case 37:
                pieceMovement('l');
                break;
            case 40:
                pieceMovement('d');
                if (currentPieceIsFalling) {
                    score += 1;
                    SCORE_ELEMENT.innerText = score;
                }
                break;
            case 39:
                pieceMovement('r');
                break;
            case 38:
                pieceMovement('u');
                break;
            case 32:
                hardDrop();
                break;
        }
    });
    END_GAME_BUTTON.addEventListener("click",() => {
        window.top.location.reload();
    })
    interval = setInterval(gameProcess, level.speed);
}

//game process
window.onload =  playTetris;