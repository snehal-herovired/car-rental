const express = require('express');
const { getAllCars, getCarByID } = require('../controllers/car-controller.js');
const carRouter = express.Router();


carRouter.get("/", getAllCars);
carRouter.get("/:id", getCarByID);

module.exports.carRouter = carRouter;