import { EmojiButton } from "https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.0";

const picker = new EmojiButton({ autoHide: false });
const trigger = document.querySelector("#emoji-trigger");
const gameboard = document.querySelector("#gameboard");

// create game board
function startGame() {
  while (gameboard.childNodes.length < 9) {
    addCellToBoard();
  } 
}

function addCellToBoard() {
  let cell = document.createElement("div");
  cell.classList.add("cell");
  gameboard.appendChild(cell);
}

startGame();

let currentPlayer;
let notCurrentPlayer;

function setCurrentPlayer() {
  return [
    (currentPlayer = currentPlayer === "player1" ? "player2" : "player1"),
    (notCurrentPlayer = currentPlayer === "player2" ? "player1" : "player2"),
  ];
}

function setPlayerEmojiIcon(selection, currentPlayer, notCurrentPlayer) {
  let player = document.querySelector(`#${currentPlayer}`);
  let notPlayer = document.querySelector(`#${notCurrentPlayer}`);
  player.textContent = selection.emoji;
  let playerIcon = player.textContent;
  let notPlayerIcon = notPlayer.textContent;
  // if (notPlayerIcon.length > 0 && playerIcon === notPlayerIcon) {
  //   player.textContent =
  //     "Player Emojis must be different - choose another one!";
  //   setPlayerEmojiIcon(selection, currentPlayer, notCurrentPlayer);
  // } else {
  //   return playerIcon;
  // }
}

picker.on("emoji", (selection) => {
  // finds which player's turn it is
  [currentPlayer, notCurrentPlayer] = setCurrentPlayer();
  // sets the current player's emoji to the selected emoji
  setPlayerEmojiIcon(selection, currentPlayer, notCurrentPlayer);
  // checks that both players' icons are not the same
});

trigger.addEventListener("click", () => picker.togglePicker(trigger));
