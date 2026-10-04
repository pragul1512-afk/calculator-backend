// Function to perform calculator operations.
function calculate(num1, num2, operator) {

    // Check which operator was selected.
    switch (operator) {

        // Addition.
        case "+":
            return num1 + num2;

        // Subtraction.
        case "-":
            return num1 - num2;

        // Multiplication.
        case "*":
            return num1 * num2;

        // Division.
        case "/":

            // Check for division by zero.
            if (num2 === 0) {
                throw new Error("Cannot divide by zero");
            }

            // Perform division.
            return num1 / num2;

        // If the operator is invalid.
        default:
            throw new Error("Invalid operator");
    }
}


// Export the calculate function.
module.exports = {
    calculate
};