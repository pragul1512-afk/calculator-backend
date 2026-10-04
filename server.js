require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const calculatorRoutes = require("./routes/calculatorRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api", calculatorRoutes);

// Flutter Web frontend static files
const PUBLIC_DIR = path.join(__dirname, "public", "web");
app.use(express.static(PUBLIC_DIR));

// Serve Flutter UI index.html for non-API GET requests
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(path.join(PUBLIC_DIR, "index.html"));
  }
  next();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Calculator server running on port ${PORT}`);
});
