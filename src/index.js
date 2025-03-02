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
		ans = "now";
		nextUpdate = (60 * 1000 - timePassed);
	} else if (hoursPassed === 0) {
		if (minutesPassed == 1)
			ans = `1 minute ago`;
		else
			ans = `${minutesPassed} minutes ago`;
		nextUpdate = ((minutesPassed + 1) * 60 * 1000 - timePassed);
	} else if (daysPassed === 0) {
		ans = `${hoursPassed} hours ago`;
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
		nextUpdate = ((daysPassed + 1) * 24 * 60 * 60 * 1000 - timePassed);
	}
	element.innerText = ans;
	const epsilon = 10;
	setTimeout(displayRelativeDate, nextUpdate + epsilon, element, time);
}

/**
 * 
 * @param {string} chatName
 */
function createHistoryEntry(chatName) {
	const chatTime = new Date;
	const element = document.createElement("div");
	const history = /** @type {HTMLDivElement} */ (document.getElementById("history-list"));
	history.appendChild(element);

	const chatNameElement = document.createElement("div");
	chatNameElement.setAttribute("class", "history-entry-chat-name");
	element.appendChild(chatNameElement);
	chatNameElement.innerText = chatName;

	const time = document.createElement("div");
	time.setAttribute("class", "history-entry-time")
	element.appendChild(time);

	displayRelativeDate(time, chatTime);
}

createHistoryEntry("ThisChat");
createHistoryEntry("AnotherChat");
