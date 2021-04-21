import { createBoard, markTile, revealTile, markedTiles, checkLose, checkWin, STATUSES } from './logic.js'; 

const BOARD_SIZE = 10;
const MINES = 10;

const boardElement = document.querySelector('.board');
const minesLeftText = document.querySelector('.mines-left');
minesLeftText.textContent = MINES;

const winlosetext = document.querySelector('.win-lose');
const board = createBoard(BOARD_SIZE, MINES);

boardElement.style.setProperty('--size', BOARD_SIZE);
board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
        tile.element.addEventListener('click', () => {
            //reveal tile
            revealTile(board, tile);
            checkEndGame();
        });

        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault();
            markTile(tile)
            minesLeftText.textContent = MINES - markedTiles(board);
        })
    })
})

function checkEndGame() {
    const win = checkWin(board);
    const lose = checkLose(board);
    console.log(lose)
    if(win || lose){
        //stop clicks
        boardElement.addEventListener('click', stopProp, {capture: true});
        boardElement.addEventListener('contextmenu', stopProp, {capture: true});
    }
    if(win){
        winlosetext.textContent = "You win!";
    }
    if(lose){
        winlosetext.textContent = "You lose!";
        board.forEach(row => {
            row.forEach(tile => {
                if(tile.status === STATUSES.marked) markTile(tile);
                if(tile.mine) revealTile(board, tile);
            });
        });
    }
}

function stopProp(e){
    e.stopImmediatePropagation();
}




