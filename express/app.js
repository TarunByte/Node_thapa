import express from "express";
import { PORT } from "./env.js";
import path from "path";

// app - This variable holds the created Express app, which you can use to:
// Define routes (app.get(), app.post(), etc.)
// Configure middleware (app.use())
// Start the server (app.listen())

const app = express();

// In newer versions of Node.js (14.8+), you can use top-Level await without needing to wrap it in an async function.

const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
const json = await response.json();
console.log(json);

// absolute path
const staticPath = path.join(import.meta.dirname, "public");

app.use("/public", express.static(staticPath));

app.get("/products", (req, res) => {
  console.log(req.query);
  res.send(
    `<h1> user search for Product ${req.query.page} ${req.query.limit}Page </h1>`
  );
});

app.get("/profile/:username", (req, res) => {
  console.log(req.params);
  res.send(`<h1>My username is ${req.params.username} </h1>`);
});

app.get("/profile/:username/article/:slug", (req, res) => {
  console.log(req.params);
  const formatedSlug = req.params.slug.replace(/-/g, " ");
  res.send(`<h1> Article ${req.params.username} by ${formatedSlug} </h1>`);
});

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
