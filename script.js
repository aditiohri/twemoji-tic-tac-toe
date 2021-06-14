import { EmojiButton } from "https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.0";

const card = document.querySelector("[data-card]");

const emojiOptions = { position: "top-start" };

let state = {
  // refactor into class constructor?
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

setPlayerEmojiPickers();

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
  resetBtn.textContent = "Start Over";
  resetBtn.addEventListener("click", resetGame);
  card.appendChild(resetBtn);
}

function resetGame(event) {
  for (let token in state.playerIcons) {
    state.playerIcons[token] = "";
  }
  removeChildren(card);
  setPlayerEmojiPickers();
  event.target.remove();
}

function moveEmojiIconsAboveBoard() {
  const playerBtns = [
    ["player1", document.querySelector("#player1Btn")],
    ["player2", document.querySelector("#player2Btn")],
  ];
  playerBtns.forEach((btn) => {
    let btnEl = btn[1];
    btnEl.parentNode.removeChild(btnEl);
  });
  let playerIconBtns = document.querySelector("#avatars");
  let versus = document.createElement("span");
  versus.textContent = "VS";
  let players = document.querySelector(".players");
  players.after(versus);
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

function addEmojiToCell(cell) {
  const emoji = state.player1
    ? state.playerIcons.player1
    : state.playerIcons.player2;
  cell.append(emoji);
}

function handleCellHover(event) {
  const cell = event.target;
  if (!cell.classList.contains("marked")) {
    addEmojiToCell(cell);
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
  if (!cell.hasChildNodes()) {
    addEmojiToCell(cell);
  }
  // add index of cell to player moves array in state to track winner
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

function createElement(elementType, attributes) {
  let element = document.createElement(elementType);
  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  }
  return element;
}

function setBoard() {
  let board = createElement("div", { class: "board", id: "board" });
  let instructions = createElement("div", { class: "instructions" });
  let avatars = createElement("div", {
    class: "avatars",
    id: "avatars",
  });
  let startBtn = createElement("button", {
    class: "hide",
    id: "start",
    disabled: true,
  });
  startBtn.textContent = "START GAME";
  startBtn.addEventListener("click", startGame);
  return [board, instructions, avatars, startBtn];
}

function setPlayerEmojiPickers() {
  // create board element
  let [board, instructions, avatars, startBtn] = setBoard();
  instructions.append(startBtn);
  // for each player
  let emojiPickers = ["Player One", "Player Two"].map((player, idx) => {
    let playerNum = idx + 1;
    // create player div
    let div = createElement("div", { class: "players" });
    // create emoji picker button
    let btn = createElement("button", {
      id: `player${playerNum}Btn`,
    });
    btn.textContent = `${player}`;
    let emojiPicker = new EmojiButton(emojiOptions);
    let emojiToken = createElement("span", {
      id: `player${playerNum}Icon`,
    });
    console.log(emojiToken);
    emojiPicker.on("emoji", (selection) => {
      // create element for the emoji
      btn.before(emojiToken);
      state.playerIcons[`player${playerNum}`] = selection.emoji;
      emojiToken.textContent = state.playerIcons[`player${playerNum}`];
      // place the emoji token element before the btn element
      // if both players have emojis set
      if (state.playerIcons.player1 && state.playerIcons.player2) {
        // activate the start button
        startBtn.disabled = false;
        startBtn.classList.remove("hide");
      }
    });
    btn.addEventListener("click", () => {
      emojiPicker.togglePicker(btn);
    });
    div.append(btn);
    return div;
  });

  emojiPickers.forEach((picker) => {
    avatars.append(picker);
  });

  instructions.appendChild(avatars);
  board.appendChild(instructions);
  card.appendChild(board);
}
