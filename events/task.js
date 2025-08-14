//? Challenge: "Event Maestro: Handle It All!"

//! Objective
//* Create a program using Node.js EventEmitter that:

//? Listens for multiple types of user events (e.g., login, logout, purchase, and profile update).
//? Tracks how many times each event is emitted.
//? Logs a summary of all event occurrences when a special summary event is triggered.

//! Requirements
//? Create at least four custom events (e.g., user-login, user-logout, user-purchase, profile-update).
//? Emit these events multiple times with different arguments (e.g., username, item purchased).
//? Track and store the count of each event type.
//? Define a summary event that logs a detailed report of how many times each event was triggered.

const fs = require("fs");
const EventEmitter = require("events");
const emitter = new EventEmitter();

const filePath = "eventCounts.json";

let eventCounts = {
  "user-login": 0,
  "user-logout": 0,
  "user-purchase": 0,
  "profile-update": 0,
};

// Load previous counts from file if exists
if (fs.existsSync(filePath)) {
  const data = fs.readFileSync(filePath, "utf-8");
  eventCounts = JSON.parse(data);
}

// Save counts to file
function saveCounts() {
  fs.writeFileSync(filePath, JSON.stringify(eventCounts, null, 2), "utf-8");
}

emitter.on("user-login", (username) => {
  eventCounts["user-login"]++;
  console.log(`${username} logged in!`);
  saveCounts();
});

emitter.on("user-purchase", (username, item) => {
  eventCounts["user-purchase"]++;
  console.log(`${username} purchased ${item}!`);
  saveCounts();
});

emitter.on("profile-update", (username, field) => {
  eventCounts["profile-update"]++;
  console.log(`${username} updated their ${field}!`);
  saveCounts();
});

emitter.on("user-logout", (username) => {
  eventCounts["user-logout"]++;
  console.log(`${username} logged out!`);
  saveCounts();
});

emitter.on("summary", () => {
  console.log(eventCounts);
});

// Emit some events
emitter.emit("user-login", "Thapa");
emitter.emit("user-purchase", "Thapa", "Laptop");
// emitter.emit("profile-update", "Thapa", "email");
// emitter.emit("user-logout", "Thapa");

// Show the summary
emitter.emit("summary");
