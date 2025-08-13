// Import EventEmitter class
const EventsEmitter = require("events");
//Create an instance of EventEmitter
const emitter = new EventsEmitter();
// 1. Define an event listener (addListener)
// emitter.on("greet", () => {
//   console.log(`hello vinod thapa`);
// });
// // 2. Trigger (emit) the "greet" event
// emitter.emit("greet");

//* You can also pass arguments while emitting.
// emitter.on("greet", (username, prof) => {
//   console.log(`hello ${username}, You are ${prof}, ri8`);
// });
// // 2. Trigger (emit) the "greet" event
// emitter.emit("greet", "Vinod Thapa", "Full Stack Dev");

//! but it's best idea to take a single argument as an object

emitter.on("greet", (arg) => {
  console.log(`hello ${arg.username}, You are ${arg.prof}, ri8`);
});
// 2. Trigger (emit) the "greet" event
emitter.emit("greet", { username: "Vinod Thapa", prof: "Full Stack Dev" });
