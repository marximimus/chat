/**
 * @typedef {{
 *  type: "user" | "assistant" | "too"
 * }} Message
 */


let messages = [];
let signature = "";

const input = /** @type {HTMLDivElement} */ (document.getElementById("input"));
const chat = /** @type {HTMLDivElement} */ (document.getElementById("chat"));

input.addEventListener("input", () => {
    if (input.textContent.length > 0) {
        delete input.dataset.empty;
    } else {
        input.dataset.empty = "";
    }
});

input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) {
        return;
    }

    event.preventDefault();
    sendMessage();
});
