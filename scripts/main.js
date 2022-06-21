import {Piece} from '../modules/piece.js';

//global variables and constants
const PIECES = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
];
const BOARD = convertBoard();

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

    for(let i =0;i< 20;i++) {
        for(let x=0;x<10;x++) {
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
    for(let i=0;i<20;i++) {
        for(let x=0;x< 10;x++) {
            if(PIECES[i][x] !== 0) {
                BOARD[i][x].style.backgroundColor = PIECES[i][x].toString();
            }
        }
    }
}

function addNewShapeToBoard(piece) {
    const shape = piece.shape;
    let rij=0;
    let kolom =0;

    for(let i =0;i<= 1;i++) {
        kolom = 0;
        for(let x =3;x<=6;x++) {
            PIECES[i][x] = shape[rij][kolom] === 1 ? piece.color : 0;
            kolom++;
        }
        rij++;
    }
}

//game process
generateNewPiece();