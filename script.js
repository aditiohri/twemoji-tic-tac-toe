import { EmojiButton } from "https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.0";

const board = document.getElementById("board");
const startBtn = document.querySelector("#start");
const playerBtns = [
  ["player1", document.querySelector("#player1Btn")],
  ["player2", document.querySelector("#player2Btn")],
];
const emojiBtns = {
  player1Btn: new EmojiButton({ autoHide: false, position: "top-start" }),
  player2Btn: new EmojiButton({ autoHide: false, position: "top-start" }),
};

let state = {
  currentPlayer: "",
  playerIcons: {
    player1: "",
    player2: "",
  },
  players: {
    one: true,
    two: false,
  },
  winningOutcomes: [],
  winner: "",
};

startBtn.addEventListener("click", startGame);
// create game board
function startGame() {
  // remove existing children of board
  clearBoard();
  // add 9 cells to board
  for (let cells = 0; cells < 9; cells++) {
    board.appendChild(createCell());
  }
  setPlayerEmojiPickers();
}

function clearBoard() {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
}

function createCell() {
  let cell = document.createElement("div");
  cell.classList.add("cell");
  cell.addEventListener("click", handleCellClick, { once: true });
  return cell;
}

function handleCellClick(event) {
  console.log(event.target, " clicked");
}

function setPlayerEmojiPickers() {
  playerBtns.forEach((playerBtn) => {
    const [player, btn] = playerBtn;
    const playerIcon = document.querySelector(`#${player}Icon`);
    const emojiPicker = emojiBtns[btn.id];
    emojiPicker.on("emoji", (selection) => {
      state.playerIcons[player] = selection.emoji;
      playerIcon.textContent = state.playerIcons[player];
    });
    btn.addEventListener("click", () => emojiPicker.togglePicker(btn));
  });
}
