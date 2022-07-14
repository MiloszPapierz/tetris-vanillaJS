# Tetris in Vanilla JS
This is a small project where I made tetris with pure JavaScript. There aren't any additional frameworks/libraries used. By making this project I wanted to test and improve my JavaScript skills.

## How to play?
1. Go to a directory where you want to store the files
2. Type ```git clone https://github.com/MiloszPapierz/tetris-vanillaJS.git``` in your cmd or git bash
3. Open index.html

## Game controls
* &uarr; Rotate tetromino
* &darr; Move tetromino down
* &larr; Move tetromino to left
* &rarr; Move tetromino to right
* <kbd>space</kbd> Hard drop

## Features
* Score
  * Score updates after every event that occurs a change
  * Highest score is displayed. It is also stored in localStorage
* Hard drop
  * When you press the Space key, the piece should be placed as far down possible.
  * The position of hard drop tetromino is showed on the gameboard by changing border colors
* Next piece preview
  * Next to the gameboard there is a preview of tetromino that will appear next.
