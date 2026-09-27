const calculatorModel = require("../models/calculatorModel");

function calculate(req, res) {

  try {

    const { num1, num2, operator } = req.body;

    if (num1 === undefined || num2 === undefined || !operator) {
      return res.status(400).json({
        error: "Two numbers and an operator are required"
      });
    }

    const result = calculatorModel.calculate(
      Number(num1),
      Number(num2),
      operator
    );

    res.json({
      num1: Number(num1),
      num2: Number(num2),
      operator: operator,
      result: result
    });

  } catch (error) {

    res.status(400).json({
      error: error.message
    });

  }
}

module.exports = {
  calculate
};