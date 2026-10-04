const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware");

// Register route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login);

// Current user profile route
router.get("/me", authenticateToken, authController.getProfile);

module.exports = router;
