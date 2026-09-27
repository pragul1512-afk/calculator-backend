const express = require("express");
const cors = require("cors");
const path = require("path");

const calculatorRoutes =
  require("./routes/calculatorRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", calculatorRoutes);

// Flutter Web frontend
const PUBLIC_DIR = path.join(__dirname, "public","web");

app.use(express.static(PUBLIC_DIR));

// Open Flutter UI at /
app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Calculator server running on port ${PORT}`);
});