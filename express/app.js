import express from "express";
import { PORT } from "./env.js";
import path from "path";

// app - This variable holds the created Express app, which you can use to:
// Define routes (app.get(), app.post(), etc.)
// Configure middleware (app.use())
// Start the server (app.listen())

const app = express();

// console.log(__dirname);
// console.log(__filename);
app.get("/", (req, res) => {
  // console.log(import.meta.url);
  // const __filename = new URL(import.meta.url).pathname;
  // console.log(__filename);

  const homePagePath = path.join(import.meta.dirname, "public", "index.html");

  res.sendFile(homePagePath);
});

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
