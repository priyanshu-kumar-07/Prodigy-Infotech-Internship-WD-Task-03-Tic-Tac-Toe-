const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const toggleModeBtn = document.getElementById("toggleMode");
const playAIBtn = document.getElementById("playAI");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = true;
let vsComputer = false;
let scores = { X: 0, O: 0 };

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", cellClicked));
resetBtn.addEventListener("click", resetGame);
toggleModeBtn.addEventListener("click", () => document.body.classList.toggle("dark"));
playAIBtn.addEventListener("click", () => {
  vsComputer = !vsComputer;
  playAIBtn.textContent = vsComputer ? "Playing vs Computer" : "Play vs Computer";
  resetGame();
});

function cellClicked() {
  const index = this.dataset.index;
  if (board[index] !== "" || !running) return;

  makeMove(index, currentPlayer);

  if (vsComputer && running && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  clickSound.play();
  checkWinner();
}

function checkWinner() {
  let winner = null;

  for (let condition of winPatterns) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winner = board[a];
      highlightCells(condition);
      break;
    }
  }

  if (winner) {
    statusText.textContent = `Player ${winner} Wins!`;
    scores[winner]++;
    updateScore();
    winSound.play();
    running = false;
  } else if (!board.includes("")) {
    statusText.textContent = "It's a Draw!";
    running = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function highlightCells(indices) {
  indices.forEach(i => cells[i].classList.add("winner"));
}

function updateScore() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  running = true;
  statusText.textContent = "Player X's Turn";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winner");
  });
}

function computerMove() {
  let available = board.map((val, i) => val === "" ? i : null).filter(v => v !== null);
  if (available.length === 0) return;
  let randomIndex = available[Math.floor(Math.random() * available.length)];
  makeMove(randomIndex, "O");
}
