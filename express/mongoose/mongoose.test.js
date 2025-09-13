import mongoose from "mongoose";
// step 1: to connect to the mongoDB server
try {
  await mongoose.connect("mongodb://localhost:27017/mongoose_database");
  // mongoose.set("debug", true);
} catch (error) {
  console.log(error);
  process.exit();
}

// step 2: create schema
const userSchema = mongoose.Schema({
  //   name: String,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true, min: 5 },
  createdAt: { type: Date, default: Date.now() },
});

// step 3: creating a model
const Users = mongoose.model("user", userSchema);

// await Users.create({ name: "thapa", age: 21, email: "thapa@technical.com" });

const userData = [
  { name: "Alice", email: "alice@example.com", age: 20 },
  { name: "Bob", email: "bob@example.com", age: 19 },
  { name: "charlie", email: "charlie@example.com", age: 22 },
];

//? step1: Insert
// await Users.insertMany(userData);

//? step 2: Read
// const users = await Users.find();
// const users = await Users.find({ age: { $gt: 21 } });
// console.log(users);

//? step 3: Update
// const updatedUser = await Users.updateOne(
//   { email: "bob@example.com" },
//   // { $set: { age: 20 } }
//   { $inc: { age: 3 } }
// );
// console.log(updatedUser);

//? step 4: Delete
const deletedUser = await Users.deleteOne({ email: "bob@example.com" });
console.log(deletedUser);

await mongoose.connection.close();
