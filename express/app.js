import express from "express";
import { PORT } from "./env.js";
import path from "path";

// app - This variable holds the created Express app, which you can use to:
// Define routes (app.get(), app.post(), etc.)
// Configure middleware (app.use())
// Start the server (app.listen())

const app = express();

// absolute path
const staticPath = path.join(import.meta.dirname, "public");

app.use(express.static(staticPath));

app.use(express.urlencoded({ extended: true }));

// app.get("/contact", (req, res) => {
//   console.log(req.query);
//   res.send("Ok");
// });

app.post("/contact", (req, res) => {
  console.log(req.body);
  res.send("/");
});

app.use((req, res) => {
  // return res.status(404).send("<h1> page not found </h1>");
  return res
    .status(404)
    .sendFile(path.join(import.meta.dirname, "views", "404.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
