import { EmojiButton } from "https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.0";

const picker = new EmojiButton({ autoHide: false });
const trigger = document.querySelector("#emoji-trigger");


picker.on("emoji", (selection) => {
  trigger.textContent = selection.emoji;
});

trigger.addEventListener("click", () => picker.togglePicker(trigger));
// document.addEventListener(
//   "DOMContentLoaded",

// );
// import { EmojiButton } from "@joeattardi/emoji-button";

// const picker = new EmojiButton();
// const trigger = document.querySelector("#emoji-trigger");

// picker.on("emoji", (selection) => {
//   // handle the selected emoji here
//   console.log(selection.emoji);
// });

// trigger.addEventListener("click", () => picker.togglePicker(trigger));
