import { EmojiButton } from "https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.0";

let state = {
  player1: true,
  playerTokens: {
    player1: "",
    player2: "",
  },
  arrayOfCells: () => Array.from(document.getElementById("board").children),
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
  winner: "",
};

const card = document.querySelector("[data-card]");
const emojiOptions = { position: "top-start" };
const getCurrentPlayer = () => (state.player1 ? "player1" : "player2");
document.body.onload = setPlayerEmojiPickers();

function startGame() {
  // move player emojis above board
  moveEmojiTokensAboveBoard();
  // remove existing children of board
  removeChildren(board);
  // add 9 cells to board
  for (let cells = 0; cells < 9; cells++) {
    board.appendChild(createCell());
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
  for (let token in state.playerTokens) {
    state.playerTokens[token] = "";
  }
  state.playerMoves.forEach((movesArr) => (movesArr = []));
  removeChildren(card);
  setPlayerEmojiPickers();
  event.target.remove();
}

function moveEmojiTokensAboveBoard() {
  const playerBtns = [
    document.querySelector("#player1Btn"),
    document.querySelector("#player2Btn"),
  ];
  playerBtns.forEach((btn) => {
    btn.parentNode.removeChild(btn);
  });
  let playerTokenBtns = document.querySelector("#avatars");
  let versus = document.createElement("span");
  versus.textContent = "VS";
  let players = document.querySelector(".players");
  players.after(versus);
  card.insertBefore(playerTokenBtns, board);
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
    ? state.playerTokens.player1
    : state.playerTokens.player2;
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
  checkWin();
}

function markCell(cell) {
  cell.classList.add("marked");
}

function updatePlayerMoves(cell) {
  const cellIdx = state.arrayOfCells().indexOf(cell);
  state.playerMoves[getCurrentPlayer()].push(cellIdx);
}

function checkWin() {
  const currentPlayerMoves = state.playerMoves[getCurrentPlayer()];
  console.log(currentPlayerMoves);
  if (currentPlayerMoves.length > 2) {
    // for each of the winning outcomes arrays
    const win = state.winningOutcomes.some((winningArr) => {
      // if all of one of the array numbers
      // are in the current players moves array
      // the player has won
      return winningArr.every((num) => currentPlayerMoves.includes(num));
    });
    console.log("checked win: ", win);
    if (win) {
      state.winner = getCurrentPlayer();
      console.log(state.winner, "is the winner!"); // TODO code UI for win message
      return; // TODO deactivate all event listeners on the board
      // if both players have 3+ items in their playerMoves array
      // it's a tie
    } else if (checkTie() === true) {
      console.log("nobody wins it sa tieeee");
      return;
    } else swapTurns();
  } else swapTurns();
}

function checkTie() {
  const { player1, player2 } = state.playerMoves;
  return player1.length === player2.length && player1.length > 3;
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
  startBtn.addEventListener("click", startGame);
  return [board, instructions, avatars, startBtn];
}

// TO DO break into smaller functions
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
      id: `player${playerNum}Token`,
    });
    emojiPicker.on("emoji", (selection) => {
      // create element for the emoji
      btn.before(emojiToken);
      state.playerTokens[`player${playerNum}`] = selection.emoji;
      emojiToken.textContent = state.playerTokens[`player${playerNum}`];
      // place the emoji token element before the btn element
      // if both players have emojis set
      const { player1, player2 } = state.playerTokens;
      // check if players' emojis are the same
      if (player1 && player2) {
        startBtn.classList.remove("hide");
        if (player1 === player2) {
          startBtn.textContent = "Players must choose different emojis 🤨";
          startBtn.disabled = true;
        } else if (player1 !== player2) {
          startBtn.textContent = "START GAME";
          startBtn.disabled = false;
        }
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
