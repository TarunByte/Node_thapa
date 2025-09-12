import mongoose from "mongoose";
// step 1: to connect to the mongoDB server
try {
  await mongoose.connect("mongodb://localhost:27017/mongoose_database");
  mongoose.set("debug", true);
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

await Users.create({ name: "thapa", age: 21, email: "thapa@technical.com" });

await mongoose.connection.close();
