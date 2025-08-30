import express from "express";

// app - This variable holds the created Express app, which you can use to:
// Define routes (app.get(), app.post(), etc.)
// Configure middleware (app.use())
// Start the server (app.listen())

const app = express();

app.get("/", (req, res) => res.send("<h1>Hello World!</h1>"));

app.get("/about", (req, res) => res.send("<h1>Hello About Page!</h1>"));

app.get("/contact", (req, res) => {
  return res.send(` <div class="container">
      <h1>URL Shortener</h1>
      <form id="shorten-form">
        <div>
          <label for="url">Enter URL:</label>
          <input type="url" name="url" id="url" required />
        </div>
        <div>
          <label for="shortCode">Enter shortCode:</label>
          <input type="text" name="shortCode" id="shortCode" required />
        </div>
        <button type="submit">Shorten</button>
      </form>

      <h2>Shortened URLs</h2>
      <ul id="shortened-urls"></ul>
    </div>`);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
