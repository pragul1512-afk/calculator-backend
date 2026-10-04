//// Import Express.
//const express = require("express");
//
//// Create an Express router.
//const router = express.Router();
//
//// Import the calculator controller.
//const calculatorController =
//    require("../controllers/calculatorController");
//
//// Create POST API for performing a calculation and saving history.
//router.post(
//    "/calculate",
//
//    // Call the calculate controller.
//    calculatorController.calculate
//);
//
//// Create GET API for getting all calculator history.
//router.get(
//    "/history",
//
//    // Call the getHistory controller.
//    calculatorController.getHistory
//);
//
//// Create PUT API for updating a history record.
//router.put(
//    "/history/:id",
//
//    // Call the updateHistory controller.
//    calculatorController.updateHistory
//);
//
//// Create DELETE API for deleting a history record.
//router.delete(
//    "/history/:id",
//
//    // Call the deleteHistory controller.
//    calculatorController.deleteHistory
//);
//
//// Export the router.
//module.exports = router;
const express = require("express");

const router = express.Router();

const calculatorController =
    require("../controllers/calculatorController");

router.post(
    "/calculate",
    calculatorController.calculate
);

router.get(
    "/history",
    calculatorController.getHistory
);

router.put(
    "/history/:id",
    calculatorController.updateHistory
);

router.delete(
    "/history/:id",
    calculatorController.deleteHistory
);

module.exports = router;