import express from "express";
import { shortenerRoutes } from "./routes/shortener.routes.js";
import { connectDB } from "./config/db-client.js";
import { env } from "./config/env.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
// app.set("views", "./views");

//? In Express.js, a template engine is a tool that lets you embed dynamic content into HTML files and render them on the server before sending them to the client. It allows you to create reusable templates, making it easier to generate dynamic web pages with minimal code.

//express router
// app.use(router);
app.use(shortenerRoutes);

try {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log("Server starting on port 3000");
  });
} catch (error) {
  console.log(error);
}
