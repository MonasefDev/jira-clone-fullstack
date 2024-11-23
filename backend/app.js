require("dotenv").config();
const express = require("express");
const uploadRoute = require("./routes/upload");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World! from nodemon");
});

// Upload route
app.use("/api", uploadRoute);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
