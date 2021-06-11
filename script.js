import { EmojiButton } from "https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.0";

const picker = new EmojiButton({ autoHide: false });
const trigger = document.querySelector("#emoji-trigger");
const gameboard = document.getElementById("gameboard");
const startBtn = document.querySelector("#start");

startBtn.addEventListener("click", startGame);
// create game board
function startGame() {
  // remove existing children of gameboard
  clearBoard();
  // add 9 cells to gameboard
  for (let cells = 0; cells < 9; cells++) {
    gameboard.appendChild(createCell());
  }
}

function clearBoard() {
  while (gameboard.firstChild) {
    gameboard.removeChild(gameboard.firstChild);
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
