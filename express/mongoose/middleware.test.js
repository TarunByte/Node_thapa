import mongoose from "mongoose";
// step 1: to connect to the mongoDB server
try {
  await mongoose.connect("mongodb://localhost:27017/mongoose_middleware");
  mongoose.set("debug", true);
} catch (error) {
  console.log(error);
  process.exit();
}

// step 2: create schema
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true, min: 5 },
    //   createdAt: { type: Date, default: Date.now() },
    //   updatedAt: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  }
);

// // we will use middleware
// userSchema.pre(
//   ["updateOne", "updateMany", "findOneAndUpdate"],
//   function (next) {
//     this.set({ updatedAt: Date.now() });
//     next();
//   }
// );

// step 3: create a model
const Users = mongoose.model("users", userSchema);

// step 4: to insert the data
// await Users.create({ name: "thapa", age: 21, email: "thapa@technical.com" });

// step 4: to insert the data
await Users.updateOne({ email: "thapa@technical.com" }, { $set: { age: 20 } });

await mongoose.connection.close();
