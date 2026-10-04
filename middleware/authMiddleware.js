const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "Access token is required. Please log in."
        });
    }

    const secret = process.env.JWT_SECRET || "fallback_default_secret_key";

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({
                error: "Invalid or expired token. Please log in again."
            });
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
