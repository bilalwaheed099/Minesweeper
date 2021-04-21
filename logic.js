var board = document.querySelector('.board');
//Variables

var BOARD_SIZE = 10;
var MINES = 4;

export var STATUSES = {
    hidden: 'hidden',
    number: 'number',
    marked: 'marked',
    mine: 'mine'
}

export function createBoard(boardSize){

    const minePositions = createMines(boardSize)
    //making the arrays of tiles
    var board = []
    for(var x = 0; x < boardSize; x++){
        var row = [];
        for(var y = 0; y < boardSize; y++){
            const element = document.createElement('div');
            element.dataset.status = STATUSES.hidden;
            var tile = {
                element,
                x,
                y,
                mine: minePositions.some(positionMatch.bind(null, {x, y})),
                get status(){
                    return this.element.dataset.status
                },
                set status(status){
                    this.element.dataset.status = status
                }
            }
            row.push(tile);
        }
        board.push(row)
    }
    return board;
}

export function markTile(tile){
    if(tile.status !== STATUSES.marked &&
    tile.status !== STATUSES.hidden ){
        return
    }
    if(tile.status === STATUSES.marked){
        tile.status = STATUSES.hidden;
    }else {
        tile.status = STATUSES.marked;
    }
}

export function revealTile(board, tile){
    if(tile.status !== STATUSES.hidden){
        return;
    }

    if(tile.mine){
        //reveal all mines
        //game over
        tile.status = STATUSES.mine;


    }
    if(!tile.mine){
        tile.status = STATUSES.number;
        var adjTiles = nearbyTiles(board, tile);
        console.log(adjTiles)
        const mineCount = adjTiles.filter(tile => tile.mine).length;
        if(mineCount === 0){
            adjTiles.forEach(revealTile.bind(null, board))
        }
        else{
            tile.element.textContent = mineCount;
        }
    }
}

export function markedTiles(board){
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === STATUSES.marked).length;
    }, 0);

    return markedTilesCount;
}

export function checkWin(board){
    return board.every(row => {
        return row.every(tile => {
            return tile.status === STATUSES.number || ( tile.mine && (tile.status===STATUSES.marked || tile.status === STATUSES.hidden));
        });
    });
}

export function checkLose(board){
    return board.some(row => {
        return row.some(tile => {
            return tile.status === STATUSES.mine;
        });
    });
}


function nearbyTiles(board, {x, y}){
    // tile => x and y
    var tiles = [];
    for(var xOffset = -1; xOffset <= 1; xOffset++){
        for(var yOffset = -1; yOffset <= 1; yOffset++){
            const tile = board[x + xOffset]?.[y + yOffset];
            if(tile) tiles.push(tile);    
        }
    }
    return tiles;
}

function randNumGen(){
    return Math.floor(Math.random()*10)
}

function createMines(boardSize){
    var minesPos = [];
    while(minesPos.length < boardSize){
        var x = randNumGen();
        var y = randNumGen();
        var coordinate = {
            x,
            y
        }
        if(!minesPos.some(pos => positionMatch(coordinate, pos))){
            minesPos.push(coordinate);
        }
    }
    return minesPos;
}

function positionMatch(a, b){
    return a.x === b.x && a.y === b.y;
}

