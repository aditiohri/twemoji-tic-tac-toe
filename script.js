import { EmojiButton } from "https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.0";

const emojiOptions = { position: "top-start" };

const createDOM = {
  message: () => createElement("div", { class: "message" }),
  board: () => createElement("div", { class: "board", id: "board" }),
  instructions: () => createElement("div", { class: "instructions" }),
  tokens: () =>
    createElement("div", {
      class: "tokens",
      id: "tokens",
    }),
  startBtn: () =>
    createElement("button", {
      class: "start disabled",
      id: "start",
      disabled: true,
    }),
  playerDiv: () => createElement("div", { class: "players", id: "players" }),
  playerBtn: (playerNum) =>
    createElement("button", {
      id: `player${playerNum}Btn`,
    }),
  emojiToken: (playerNum) =>
    createElement("span", {
      id: `player${playerNum}Token`,
    }),
  versus: () => createElement("span", { class: "versus" }),
  cell: () => createElement("div"),
  resetBtn: () => createElement("button"),
  heading: () => createElement("h1"),
};

const accessDOM = {
  card: () => document.querySelector("[data-card]"),
  tokens: () => document.getElementById("tokens"),
  header: () => document.getElementById("header"),
  board: () => document.getElementById("board"),
  playerToken: (playerNum) =>
    document.getElementById(`player${playerNum}Token`),
  playerBtns: () => [
    document.getElementById("player1Btn"),
    document.getElementById("player2Btn"),
  ],
  playerDivs: () => document.getElementById("players"),
};

const state = {
  allPlayers: ["Player One", "Player Two"],
  player1: true,
  playerTokens: {
    player1: "",
    player2: "",
  },
  arrayOfCells: () => Array.from(accessDOM.board().children),
  playerMoves: {
    player1: [],
    player2: [],
  },
  winningOutcomes: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ],
};

initEmojiPicker();

// Emoji Picker Setup
function initEmojiPicker() {
  const startBtn = createDOM.startBtn();
  const instructions = createDOM.instructions();
  const tokens = createDOM.tokens();
  const board = createDOM.board();
  startBtn.textContent = "Pick Your Emoji Below!";
  startBtn.addEventListener("click", startGame);
  instructions.append(startBtn);
  const emojiPickers = createEmojiPickers(startBtn);
  emojiPickers.forEach((picker) => {
    tokens.append(picker);
  });
  instructions.appendChild(tokens);
  board.appendChild(instructions);
  accessDOM.card().appendChild(board);
}

function createEmojiPickers(startBtn) {
  return state.allPlayers.map((player, idx) => {
    const playerNum = idx + 1;
    // create emoji picker button
    const btn = createDOM.playerBtn(playerNum);
    btn.textContent = `${player}`;
    // create emoji token element
    const emojiToken = createDOM.emojiToken(playerNum);
    // append emoji picker button to the player's div
    const playerDiv = createDOM.playerDiv();
    playerDiv.append(btn);
    btn.before(emojiToken);
    // create emoji picker event
    const emojiPicker = new EmojiButton(emojiOptions);
    emojiPicker.on("emoji", (selection) => {
      // assign emoji token to player
      chooseEmoji(selection, emojiToken, playerNum);
      // check if players' emojis are the same
      checkEmojisAreDifferent(startBtn);
    });
    // attach emoji picker event to button
    btn.addEventListener("click", () => {
      emojiPicker.togglePicker(btn);
    });

    return playerDiv;
  });
}

function chooseEmoji(selection, emojiToken, playerNum) {
  state.playerTokens[`player${playerNum}`] = selection.emoji;
  emojiToken.textContent = state.playerTokens[`player${playerNum}`];
  accessDOM.playerToken(playerNum).replaceWith(emojiToken);
}

function checkEmojisAreDifferent(startBtn) {
  const { player1, player2 } = state.playerTokens;
  if (player1 && player2) {
    if (player1 === player2) {
      startBtn.textContent = "Players must choose different emojis 🤨";
      startBtn.disabled = true;
    } else {
      startBtn.textContent = "START GAME";
      startBtn.classList.remove("disabled");
      startBtn.disabled = false;
    }
  }
}

// Game Board Set Up
function startGame() {
  const board = accessDOM.board();
  moveEmojiTokensAboveBoard();
  removeChildren(board);
  createBoard(9, board);
  addResetBtn();
}

function moveEmojiTokensAboveBoard() {
  accessDOM.playerBtns().forEach((btn) => {
    btn.parentNode.removeChild(btn);
  });
  accessDOM.playerDivs().after(createDOM.versus());
  accessDOM.header().firstChild.replaceWith(accessDOM.tokens());
  // accessDOM.card().insertBefore(accessDOM.tokens(), accessDOM.board());
}

function createBoard(num, element) {
  for (let cells = 0; cells < num; cells++) {
    element.appendChild(createCell());
  }
}

function createCell() {
  let cell = createDOM.cell();
  cell.classList.add("cell");
  manageEvents(cell);
  return cell;
}

function manageEvents(element, remove = false) {
  if (!remove) {
    element.addEventListener("click", handleCellClick, { once: true });
    element.addEventListener("mouseover", handleCellHover);
    element.addEventListener("mouseleave", handleCellLeave);
  } else {
    element.removeEventListener("click", handleCellClick, false);
    element.removeEventListener("mouseover", handleCellHover, false);
    element.removeEventListener("mouseleave", handleCellLeave, false);
  }
}

function addResetBtn() {
  const resetBtn = createDOM.resetBtn();
  resetBtn.textContent = "Start Over";
  resetBtn.addEventListener("click", resetGame);
  accessDOM.card().appendChild(resetBtn);
}

function resetGame(event) {
  state.player1 = true;
  initState(state.playerTokens, "");
  initState(state.playerMoves, []);
  removeChildren(accessDOM.card());
  setHeading();
  initEmojiPicker();
  event.target.remove();
}

function setHeading() {
  const heading = createDOM.heading();
  heading.textContent = "Twemoji Tic Tac Toe";
  accessDOM.header().firstChild.replaceWith(heading);
}

// Game Play Functions
function swapTurns() {
  state.player1 = !state.player1;
}

function getCurrentPlayer() {
  return state.player1 ? "player1" : "player2";
}

function addEmojiToCell(cell) {
  const currentPlayer = getCurrentPlayer();
  const emoji = state.playerTokens[currentPlayer];
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
  cell.classList.remove("hover");
  if (!cell.classList.contains("marked")) {
    removeChildren(cell);
  }
}

function handleCellClick(event) {
  const cell = event.target;
  if (!cell.hasChildNodes()) {
    addEmojiToCell(cell);
  }
  markCell(cell);
  updatePlayerMoves(cell);
  endGameOrSwapTurns();
}

function markCell(cell) {
  cell.classList.add("marked");
}

function updatePlayerMoves(cell) {
  const currentPlayer = getCurrentPlayer();
  const cellIdx = state.arrayOfCells().indexOf(cell);
  state.playerMoves[currentPlayer] =
    state.playerMoves[currentPlayer].concat(cellIdx);
}

// Game End Functions
function deactivateCells() {
  const board = accessDOM.board().children;
  for (let cell of board) {
    if (!cell.className.includes("marked")) {
      manageEvents(cell, true);
    }
  }
}

function endGameOrSwapTurns() {
  const currentPlayerMoves = state.playerMoves[getCurrentPlayer()];
  if (currentPlayerMoves.length > 2) {
    const win = state.winningOutcomes.some((winningArr) =>
      winningArr.every((num) => currentPlayerMoves.includes(num))
    );
    const tie = win ? false : checkTie();
    if (win || tie) {
      endGame(win, tie);
      return;
    }
  }
  swapTurns();
}

function endGame(win, tie) {
  let messageText = "";
  if (win) {
    messageText = `${state.playerTokens[getCurrentPlayer()]} is the winner!`;
  } else if (tie) {
    messageText = "No one wins! It's a tie!";
  }
  displayEndMessage(messageText);
}

function displayEndMessage(messageText) {
  const message = createDOM.message();
  message.textContent = messageText;
  deactivateCells();
  accessDOM.tokens().replaceWith(message);
}

function checkTie() {
  const { player1, player2 } = state.playerMoves;
  return player1.length === player2.length && player1.length > 3;
}

// Utility Functions
function createElement(elementType, attributes) {
  let element = document.createElement(elementType);
  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  }
  return element.cloneNode(true);
}

function removeChildren(element) {
  if (element.children) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}

function initState(stateVariable, initialValue) {
  for (let key in stateVariable) {
    stateVariable[key] = initialValue;
  }
}
