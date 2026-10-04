// Import the calculator model.
const calculatorModel = require("../models/calculatorModel");

// Import the PostgreSQL connection pool.
const pool = require("../config/database");


// Calculate and save the calculation to PostgreSQL.
async function calculate(req, res) {

    try {

        // Get the input values from the request body.
        const { num1, num2, operator } = req.body;

        // Check whether all required values are provided.
        if (num1 === undefined || num2 === undefined || !operator) {

            // Send a 400 Bad Request response.
            return res.status(400).json({

                // Error message.
                error: "Two numbers and an operator are required"

            });
        }


        // Convert the first number to a JavaScript number.
        const number1 = Number(num1);

        // Convert the second number to a JavaScript number.
        const number2 = Number(num2);


        // Perform the calculation using the model.
        const result = calculatorModel.calculate(
            number1,
            number2,
            operator
        );


        // Save the calculation in PostgreSQL.
        const saved = await pool.query(

            // SQL INSERT query.
            `INSERT INTO calculation_history
             (num1, num2, operator, result)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,

            // Values for $1, $2, $3 and $4.
            [
                number1,
                number2,
                operator,
                result
            ]
        );


        // Send the saved record back to Flutter.
        res.json(saved.rows[0]);


    }  catch (error) {

          console.error("CALCULATE ERROR:", error);

          res.status(400).json({
              error: error.message || "Unknown backend error"
          });
    }
}



// Get all calculation history from PostgreSQL.
async function getHistory(req, res) {

    try {

        // Get all records from the database.
        const result = await pool.query(

            // SQL SELECT query.
            `SELECT *
             FROM calculation_history
             ORDER BY created_at DESC`
        );


        // Send history records to Flutter.
        res.json(result.rows);


    }  catch (error) {

          console.error("CALCULATE ERROR:", error);

          res.status(400).json({
              error: error.message || "Unknown backend error"
          });
      }
}



// Update an existing history record.
async function updateHistory(req, res) {

    try {

        // Get the ID from the URL.
        const { id } = req.params;

        // Get updated values from Flutter.
        const { num1, num2, operator } = req.body;


        // Convert first number to number.
        const number1 = Number(num1);

        // Convert second number to number.
        const number2 = Number(num2);


        // Calculate the new result.
        const result = calculatorModel.calculate(
            number1,
            number2,
            operator
        );


        // Update the record in PostgreSQL.
        const updated = await pool.query(

            // SQL UPDATE query.
            `UPDATE calculation_history
             SET num1 = $1,
                 num2 = $2,
                 operator = $3,
                 result = $4
             WHERE id = $5
             RETURNING *`,

            // Values for the SQL query.
            [
                number1,
                number2,
                operator,
                result,
                id
            ]
        );


        // Check whether the record exists.
        if (updated.rows.length === 0) {

            // Send not-found response.
            return res.status(404).json({

                // Error message.
                error: "History record not found"

            });
        }


        // Send updated record to Flutter.
        res.json(updated.rows[0]);


    }  catch (error) {

          console.error("CALCULATE ERROR:", error);

          res.status(400).json({
              error: error.message || "Unknown backend error"
          });
      }
}



// Delete a history record.
async function deleteHistory(req, res) {

    try {

        // Get the ID from the URL.
        const { id } = req.params;


        // Delete the record from PostgreSQL.
        const deleted = await pool.query(

            // SQL DELETE query.
            `DELETE FROM calculation_history
             WHERE id = $1
             RETURNING *`,

            // ID value.
            [id]
        );


        // Check whether the record exists.
        if (deleted.rows.length === 0) {

            // Send not-found response.
            return res.status(404).json({

                // Error message.
                error: "History record not found"

            });
        }


        // Send successful delete response.
        res.json({

            // Success message.
            message: "History deleted successfully",

            // Deleted record.
            data: deleted.rows[0]

        });


    }  catch (error) {

          console.error("CALCULATE ERROR:", error);

          res.status(400).json({
              error: error.message || "Unknown backend error"
          });
      }
}



// Export all controller functions.
module.exports = {

    // Export calculation function.
    calculate,

    // Export history function.
    getHistory,

    // Export update function.
    updateHistory,

    // Export delete function.
    deleteHistory

};