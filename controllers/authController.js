const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET || "fallback_default_secret_key";

// Register new user
async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                error: "Username, email, and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "Password must be at least 6 characters long"
            });
        }

        // Check if username or email already exists
        const userCheck = await pool.query(
            "SELECT * FROM users WHERE email = $1 OR username = $2",
            [email.toLowerCase().trim(), username.trim()]
        );

        if (userCheck.rows.length > 0) {
            const existing = userCheck.rows[0];
            if (existing.email.toLowerCase() === email.toLowerCase().trim()) {
                return res.status(400).json({ error: "Email is already registered" });
            }
            return res.status(400).json({ error: "Username is already taken" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const newUser = await pool.query(
            `INSERT INTO users (username, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, username, email, created_at`,
            [username.trim(), email.toLowerCase().trim(), hashedPassword]
        );

        const user = newUser.rows[0];

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User registered successfully",
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({
            error: error.message || "Failed to register user"
        });
    }
}

// Login user
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        // Find user by email or username
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1 OR username = $1",
            [email.toLowerCase().trim()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: "Invalid email/username or password"
            });
        }

        const user = result.rows[0];

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: "Invalid email/username or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({
            error: error.message || "Failed to log in"
        });
    }
}

// Get current user profile
async function getProfile(req, res) {
    try {
        const result = await pool.query(
            "SELECT id, username, email, created_at FROM users WHERE id = $1",
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("PROFILE ERROR:", error);
        res.status(500).json({ error: "Failed to fetch user profile" });
    }
}

module.exports = {
    register,
    login,
    getProfile
};
