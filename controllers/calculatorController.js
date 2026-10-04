const calculatorModel = require("../models/calculatorModel");
const pool = require("../config/database");

// Calculate and save the calculation for the authenticated user
async function calculate(req, res) {
    try {
        const { num1, num2, operator } = req.body;
        const userId = req.user.id; // Extracted from JWT token

        if (num1 === undefined || num2 === undefined || !operator) {
            return res.status(400).json({
                error: "Two numbers and an operator are required"
            });
        }

        const number1 = Number(num1);
        const number2 = Number(num2);

        const result = calculatorModel.calculate(number1, number2, operator);

        // Save calculation with user_id associated
        const saved = await pool.query(
            `INSERT INTO calculation_history (user_id, num1, num2, operator, result)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [userId, number1, number2, operator, result]
        );

        res.json(saved.rows[0]);
    } catch (error) {
        console.error("CALCULATE ERROR:", error);
        res.status(400).json({
            error: error.message || "Unknown backend error"
        });
    }
}

// Get calculation history ONLY for the authenticated user
async function getHistory(req, res) {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT * FROM calculation_history
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("GET HISTORY ERROR:", error);
        res.status(400).json({
            error: error.message || "Unknown backend error"
        });
    }
}

// Update an existing history record for the authenticated user
async function updateHistory(req, res) {
    try {
        const { id } = req.params;
        const { num1, num2, operator } = req.body;
        const userId = req.user.id;

        const number1 = Number(num1);
        const number2 = Number(num2);

        const result = calculatorModel.calculate(number1, number2, operator);

        const updated = await pool.query(
            `UPDATE calculation_history
             SET num1 = $1, num2 = $2, operator = $3, result = $4
             WHERE id = $5 AND user_id = $6
             RETURNING *`,
            [number1, number2, operator, result, id, userId]
        );

        if (updated.rows.length === 0) {
            return res.status(404).json({
                error: "History record not found or unauthorized"
            });
        }

        res.json(updated.rows[0]);
    } catch (error) {
        console.error("UPDATE HISTORY ERROR:", error);
        res.status(400).json({
            error: error.message || "Unknown backend error"
        });
    }
}

// Delete a history record for the authenticated user
async function deleteHistory(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deleted = await pool.query(
            `DELETE FROM calculation_history
             WHERE id = $1 AND user_id = $2
             RETURNING *`,
            [id, userId]
        );

        if (deleted.rows.length === 0) {
            return res.status(404).json({
                error: "History record not found or unauthorized"
            });
        }

        res.json({
            message: "History deleted successfully",
            data: deleted.rows[0]
        });
    } catch (error) {
        console.error("DELETE HISTORY ERROR:", error);
        res.status(400).json({
            error: error.message || "Unknown backend error"
        });
    }
}

module.exports = {
    calculate,
    getHistory,
    updateHistory,
    deleteHistory
};
