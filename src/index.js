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

/**
 *
 * @param {HTMLElement} element
 * @param {Date} time
 */

function displayRelativeDate(element, time) {
    const timePassed = Date.now() - time.getTime();
    const secondsPassed = Math.floor(timePassed / 1000);
    const minutesPassed = Math.floor(secondsPassed / 60);
    const hoursPassed = Math.floor(minutesPassed / 60);
    const daysPassed = Math.floor(hoursPassed / 24);
    let ans;
    let nextUpdate;
    if (minutesPassed === 0) {
        ans = "Now";
        nextUpdate = (60 * 1000 - timePassed);
    } else if (hoursPassed === 0) {
        ans = `${minutesPassed} minute${minutesPassed > 1 ? "s" : ""} ago`;
        nextUpdate = ((minutesPassed + 1) * 60 * 1000 - timePassed);
    } else if (daysPassed === 0) {
        ans = `${hoursPassed} hour${hoursPassed > 1 ? "s" : ""} ago`;
        nextUpdate = ((hoursPassed + 1) * 60 * 60 * 1000 - timePassed);
    } else if (daysPassed < 7) {
        if (daysPassed == 1) {
            ans = `Yesterday`;
        } else
            ans = `Last ${new Intl.DateTimeFormat(["en-US"], { weekday: "long" }).format(time)}`;
        nextUpdate = ((daysPassed + 1) * 24 * 60 * 60 * 1000 - timePassed);
    } else {
        ans = new Intl.DateTimeFormat(["en-US"], {
            dateStyle: "long",
        }).format(time);
        nextUpdate = null;
    }
    element.innerText = ans;
    if (nextUpdate !== null) {
        setTimeout(displayRelativeDate, nextUpdate, element, time);
    }
}

const trashBin = (() => {
    const template = /** @type {HTMLTemplateElement} */ (document.getElementById("trash-bin"));
    return /** @type {HTMLElement} */ (template.content.firstElementChild);
})();

const historyList = /** @type {HTMLDivElement} */ (document.getElementById("history-list"));

/**
 * @param {string} id
 * @param {string} name
 */
function createHistoryEntry(id, name) {
    const chatTime = new Date;
    const entry = document.createElement("div");
    historyList.appendChild(entry);
    const link = document.createElement("a");
    link.href = `/chat/${encodeURIComponent(id)}`;
    entry.appendChild(link);

    const chatNameElement = document.createElement("div");
    chatNameElement.classList.add("medium-2", "color-primary");
    link.appendChild(chatNameElement);
    chatNameElement.innerText = name;

    const time = document.createElement("div");
    time.classList.add("caption", "color-secondary");
    link.appendChild(time);
    entry.addEventListener("mouseenter", () => {
        entry.appendChild(trashBin);
    });
    entry.addEventListener("mouseleave", () => {
        trashBin.remove();
    });

    displayRelativeDate(time, chatTime);
}

trashBin.addEventListener("click", () => {
    const entry = /** @type {HTMLElement} */ (trashBin.parentElement);
    entry.remove();
    // TODO: add code to remove the actual chat, not only the history entry.
});

const addNewChatButton = /** @type {HTMLElement} */ (document.getElementById("add-new-chat-button"));
addNewChatButton.addEventListener("click", () => {
    createHistoryEntry("new-id", "name");
});
