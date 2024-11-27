const express = require("express");
const uploadRoute = require("./routes/upload");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World! from nodemon");
});

// Upload route
app.use("/api", uploadRoute);
