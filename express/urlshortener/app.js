import express from "express";
import { shortenerRoutes } from "./routes/shortener.routes.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//express router
// app.use(router);
app.use(shortenerRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
