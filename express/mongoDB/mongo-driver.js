import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("mongodb_nodejs_db");
const userCollection = db.collection("users");

// userCollection.insertOne({ name: "vinod technical", age: 22 });

// userCollection.insertMany([
//   { name: "technical", role: "user", age: 22 },
//   { name: "thapa", role: "user", age: 23 },
//   { name: "bahadur ", role: "admin", age: 24 },
// ]);

// Read
// const userCursor = userCollection.find();
// console.log(userCursor);

// for await (const user of userCursor) {
//   console.log(user);
// }

// const userCursor = await userCollection.find().toArray();
// console.log(userCursor);

// const user = await userCollection.findOne({ name: "vinod thapa" });
// console.log(user);
// console.log(user._id.toHexString());

// Update
// await userCollection.updateOne({ name: "thapa" }, { $set: { age: 21 } });

// Delete
const result = await userCollection.deleteMany({ name: "vinod technical" });
console.log(`${result.deletedCount} documents deleted.`);
