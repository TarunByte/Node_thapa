import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const todos = [];

const showMenu = () => {
  console.log("\n1: Add a Task");
  console.log("2: View Tasks");
  console.log("3: Exit");
  rl.question("Choose an option: ", handleInput);
};

const handleInput = (option) => {
  if (option === "1") {
    rl.question("Enter the Task:", (task) => {
      todos.push(task);
      console.log("Task added: ", task);
      showMenu();
    });
  } else if (option === "2") {
    console.log("\n Your Todo Lists");
    todos.forEach((curTask, index) => {
      console.log(`${index + 1}. ${curTask}`);
    });
    showMenu();
  } else if (option === "3") {
    console.log("Good Byee");
    rl.close();
  } else {
    console.log("Invalid Options. Please try again");
    showMenu();
  }
};

showMenu();
