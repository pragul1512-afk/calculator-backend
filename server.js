const express = require("express");
const cors = require("cors");

const calculatorRoutes =
  require("./routes/calculatorRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", calculatorRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Calculator server running on port ${PORT}`);
});