require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "calculator_db",
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432
});

// Initialize database tables automatically
async function initDb() {
    try {
        // Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create calculation_history table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS calculation_history (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                num1 NUMERIC NOT NULL,
                num2 NUMERIC NOT NULL,
                operator VARCHAR(10) NOT NULL,
                result NUMERIC NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Ensure user_id column exists if table was created previously without it
        await pool.query(`
            ALTER TABLE calculation_history
            ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
        `);

        console.log("PostgreSQL tables initialized successfully");
    } catch (err) {
        console.error("Failed to initialize PostgreSQL tables:", err);
    }
}

pool.on("connect", () => {
    console.log("PostgreSQL connected successfully");
});

pool.on("error", (error) => {
    console.error("PostgreSQL Pool Error:");
    console.error(error);
});

// Run table initialization
initDb();

module.exports = pool;
