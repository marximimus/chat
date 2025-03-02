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


const trashBin = /** @type {HTMLElement} */ (document.getElementById("trash-bin"));
trashBin.remove();

/**
 *
 * @param {string} chatName
 */
function createHistoryEntry(chatName) {
    const chatTime = new Date;
    const history = /** @type {HTMLDivElement} */ (document.getElementById("history-list"));
    const holder = document.createElement("div");
    history.appendChild(holder);
    const captions = document.createElement("div");
    holder.appendChild(captions);

    const chatNameElement = document.createElement("div");
    chatNameElement.classList.add("medium-2", "color-primary");
    captions.appendChild(chatNameElement);
    chatNameElement.innerText = chatName;

    const time = document.createElement("div");
    time.classList.add("caption", "color-secondary");
    captions.appendChild(time);
    holder.addEventListener("mouseenter", () => {
        holder.appendChild(trashBin);
    });
    holder.addEventListener("mouseleave", () => {
        trashBin.remove();
    });

    displayRelativeDate(time, chatTime);
}

createHistoryEntry("ThisChat");
createHistoryEntry("AnotherChat");
