import express from "express";
import { shortenerRoutes } from "./routes/shortener.routes.js";
// import { connectDB } from "./config/db-client.js";
import { env } from "./config/env.js";
import { authRoutes } from "./routes/auth.routes.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
// app.set("views", "./views");

//express router
// app.use(router);
app.use(authRoutes);
app.use(shortenerRoutes);

try {
  // await connectDB();
  app.listen(env.PORT, () => {
    console.log("Server starting on port 3000");
  });
} catch (error) {
  console.log(error);
}
