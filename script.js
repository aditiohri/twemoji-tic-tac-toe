import { EmojiButton } from "https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.0";

const picker = new EmojiButton({ autoHide: false });
const trigger = document.querySelector("#emoji-trigger");
const gameboard = document.querySelector(".gameboard");
let currentPlayer = "player1";
let player = document.querySelector(`#${currentPlayer}`);

picker.on("emoji", (selection) => {
  player.textContent = selection.emoji;
  currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
  player = document.querySelector(`#${currentPlayer}`);
});

trigger.addEventListener("click", () => picker.togglePicker(trigger));
