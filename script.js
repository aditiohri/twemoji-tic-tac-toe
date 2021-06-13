import { EmojiButton } from "https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.0";

const card = document.querySelector("[data-card]");
const board = document.getElementById("board");
const startBtn = document.querySelector("#start");
const playerIconBtns = document.querySelector("[data-avatars]");

const emojiOptions = { position: "top-start" };
const playerBtns = [
  ["player1", document.querySelector("#player1Btn")],
  ["player2", document.querySelector("#player2Btn")],
];
const emojiBtns = {
  player1Btn: new EmojiButton(emojiOptions),
  player2Btn: new EmojiButton(emojiOptions),
};

let state = {
  // refactor into class constructor
  player1: true,
  playerIcons: {
    player1: "",
    player2: "",
  },
  playerMoves: {
    player1: [],
    player2: [],
  },
  winningOutcomes: [],
  winner: "",
};

const findPlayerEmoji = () =>
  state.player1 ? state.playerIcons.player1 : state.playerIcons.player2;

setPlayerEmojiPickers();

startBtn.addEventListener("click", startGame);
// create game board
function startGame() {
  // move player emojis above board
  moveEmojiIconsAboveBoard();
  // remove existing children of board
  removeChildren(board);
  // add 9 cells to board
  for (let cells = 0; cells < 9; cells++) {
    board.appendChild(createCell());
    // here is where we could update state with an array of all the board cells
  }
  addResetBtn();
}

function addResetBtn() {
  let resetBtn = document.createElement("button");
  resetBtn.textContent = "Start Over"
  resetBtn.addEventListener("click", resetGame);
  card.appendChild(resetBtn);
}

function resetGame(event) {
  removeChildren(board);
  setPlayerEmojiPickers();
  event.target.classList.add("hide");
}

function moveEmojiIconsAboveBoard() {
  playerBtns.forEach((btn) => {
    let btnEl = btn[1];
    btnEl.parentNode.removeChild(btnEl);
  });
  playerIconBtns.style.display = "flex";
  playerIconBtns.style.alignItems = "center";
  let versus = document.createElement("span");
  versus.textContent = "VS";
  let players = document.querySelectorAll(".players");
  playerIconBtns.insertBefore(versus, players[1]);
  card.insertBefore(playerIconBtns, board);
}

function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function createCell() {
  let cell = document.createElement("div");
  cell.classList.add("cell");
  cell.addEventListener("click", handleCellClick, { once: true });
  cell.addEventListener("mouseover", handleCellHover);
  cell.addEventListener("mouseleave", handleCellLeave);
  return cell;
}

function handleCellHover(event) {
  const cell = event.target;
  if (!cell.classList.contains("marked")) {
    const emoji = findPlayerEmoji();
    cell.append(emoji);
    cell.classList.add("hover");
  }
}

function handleCellLeave(event) {
  const cell = event.target;
  if (cell.classList.contains("hover")) {
    cell.classList.remove("hover");
    if (!cell.classList.contains("marked")) {
      removeChildren(cell);
    }
  }
}

function handleCellClick(event) {
  const cell = event.target;
  // add index of cell to player moves array in state
  markCell(cell);
  swapTurns();
}

function markCell(cell) {
  cell.classList.remove("hover");
  cell.classList.add("marked");
}

function swapTurns() {
  state.player1 = !state.player1;
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
      if (state.playerIcons.player1 && state.playerIcons.player2) {
        // activate the start button
        startBtn.disabled = false;
        startBtn.classList.remove("hide");
      }
    });
    btn.addEventListener("click", () => emojiPicker.togglePicker(btn));
  });
}
