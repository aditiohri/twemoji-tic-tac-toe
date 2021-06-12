import { EmojiButton } from "https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.0";

const card = document.querySelector("[data-card]");
const board = document.getElementById("board");
const startBtn = document.querySelector("#start");
const playerIconBtns = document.querySelector("[data-avatars]");
const emojiOptions = { autoHide: false, position: "top-start" };
const playerBtns = [
  ["player1", document.querySelector("#player1Btn")],
  ["player2", document.querySelector("#player2Btn")],
];
const emojiBtns = {
  player1Btn: new EmojiButton(emojiOptions),
  player2Btn: new EmojiButton(emojiOptions),
};

let state = {
  player1: true,
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

setPlayerEmojiPickers();

startBtn.addEventListener("click", startGame);
// create game board
function startGame() {
  // move emojis above board
  card.insertBefore(playerIconBtns, board);
  // remove existing children of board
  clearBoard();
  // add 9 cells to board
  for (let cells = 0; cells < 9; cells++) {
    board.appendChild(createCell());
  }
}

function clearBoard() {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
}

function createCell() {
  let cell = document.createElement("div");
  cell.classList.add("cell");
  cell.setAttribute("data-icon", state.playerIcons.player1);
  cell.addEventListener("click", handleCellClick, { once: true });
  return cell;
}

function handleCellClick(event) {
  console.log(event.target.dataset, " clicked");
  const cell = event.target;
  const emoji = cell.dataset.icon;
  const markCell = document.createElement("span");
  markCell.textContent = emoji;
  cell.append(markCell);
  cell.classList.add("marked")
}

function setPlayerEmojiPickers() {
  // before players have chosen emojis
  // set start button as disabled
  startBtn.disabled = true;
  // for each player
  // set up unique emoji picker
  playerBtns.forEach((playerBtn) => {
    const [player, btn] = playerBtn;
    const playerIcon = document.querySelector(`#${player}Icon`);
    const emojiPicker = emojiBtns[btn.id];
    // unique click event for playerX's emoji picker
    emojiPicker.on("emoji", (selection) => {
      state.playerIcons[player] = selection.emoji;
      playerIcon.textContent = state.playerIcons[player];
      // if both players have emojis set
      // activate the start button
      if (state.playerIcons.player1 && state.playerIcons.player2) {
        startBtn.disabled = false;
      }
    });
    btn.addEventListener("click", () => emojiPicker.togglePicker(btn));
  });
}
