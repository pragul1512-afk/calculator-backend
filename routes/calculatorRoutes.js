const express = require("express");
const router = express.Router();
const calculatorController = require("../controllers/calculatorController");
const authenticateToken = require("../middleware/authMiddleware");

// All calculator endpoints are protected with JWT authentication
router.post("/calculate", authenticateToken, calculatorController.calculate);
router.get("/history", authenticateToken, calculatorController.getHistory);
router.put("/history/:id", authenticateToken, calculatorController.updateHistory);
router.delete("/history/:id", authenticateToken, calculatorController.deleteHistory);

module.exports = router;
