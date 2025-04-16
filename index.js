const boxes = document.querySelectorAll(".box");
const gameInfo = document.querySelector(".game-info");
const newGameBtn = document.querySelector(".btn");

let currentPlayer;
let gameGrid;

const HUMAN = "X";
const COMPUTER = "O";

let playerScore = 0;
let computerScore = 0;
let drawScore = 0;

const playerScoreSpan = document.getElementById("player-score");
const computerScoreSpan = document.getElementById("computer-score");
const drawScoreSpan = document.getElementById("draw-score");

const winningPositions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

function initGame(){
    currentPlayer = HUMAN;
    gameGrid = ["", "", "", "", "", "", "", "", ""];

    boxes.forEach((box, index) => {
        box.innerText = "";
        boxes[index].style.pointerEvents = "all";
        box.classList = `box box${index+1}`;
    });

    newGameBtn.classList.remove("active");
    gameInfo.innerText = `Current Player - ${currentPlayer}`;
}

function swapTurn() {
    currentPlayer = (currentPlayer === HUMAN) ? COMPUTER : HUMAN;
    gameInfo.innerText = `Current Player - ${currentPlayer}`;
}

function isGameOver(board) {
    return winningPositions.some(pos =>
        board[pos[0]] !== "" &&
        board[pos[0]] === board[pos[1]] &&
        board[pos[1]] === board[pos[2]]
    );
}

function evaluate(board) {
    for (let pos of winningPositions) {
        if (board[pos[0]] && board[pos[0]] === board[pos[1]] && board[pos[1]] === board[pos[2]]) {
            return board[pos[0]] === COMPUTER ? +10 : -10;
        }
    }
    return 0;
}

function isMovesLeft(board) {
    return board.includes("");
}

function minimax(board, depth, isAI) {
    let score = evaluate(board);

    if (score === 10 || score === -10) return score;
    if (!isMovesLeft(board)) return 0;

    if (isAI) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = COMPUTER;
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = HUMAN;
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = "";
            }
        }
        return best;
    }
}

function findBestMove(board) {
    let bestVal = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = COMPUTER;
            let moveVal = minimax(board, 0, false);
            board[i] = "";
            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

function checkGameOver() {
    let winner = "";

    winningPositions.forEach((position) => {
        if (
            gameGrid[position[0]] !== "" &&
            gameGrid[position[0]] === gameGrid[position[1]] &&
            gameGrid[position[1]] === gameGrid[position[2]]
        ) {
            winner = gameGrid[position[0]];
            boxes.forEach(box => box.style.pointerEvents = "none");
            boxes[position[0]].classList.add("win");
            boxes[position[1]].classList.add("win");
            boxes[position[2]].classList.add("win");
        }
    });

    if (winner) {
        gameInfo.innerText = `Winning Player - ${winner}`;
        newGameBtn.classList.add("active");

        if (winner === HUMAN) {
            playerScore++;
            playerScoreSpan.innerText = playerScore;
        } else {
            computerScore++;
            computerScoreSpan.innerText = computerScore;
        }

        return true;
    }

    if (!gameGrid.includes("")) {
        gameInfo.innerText = "Game Tied!";
        newGameBtn.classList.add("active");
        drawScore++;
        drawScoreSpan.innerText = drawScore;
        return true;
    }

    return false;
}

function handleClick(index) {
    if (gameGrid[index] === "") {
        boxes[index].innerText = HUMAN;
        gameGrid[index] = HUMAN;
        boxes[index].style.pointerEvents = "none";

        if (checkGameOver()) return;

        swapTurn();

        // Computer's turn
        setTimeout(() => {
            const move = findBestMove(gameGrid);
            if (move !== -1) {
                gameGrid[move] = COMPUTER;
                boxes[move].innerText = COMPUTER;
                boxes[move].style.pointerEvents = "none";
                checkGameOver();
                swapTurn();
            }
        }, 500); // small delay for realism
    }
}

boxes.forEach((box, index) => {
    box.addEventListener('click', () => {
        if (currentPlayer === HUMAN) {
            handleClick(index);
        }
    });
});

newGameBtn.addEventListener('click', initGame);

initGame();