const Car = require('../models/Car.js');

module.exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.find({});
        res.status(200).json({ cars })
    } catch (err) {
        return console.log(err);
    }
}

module.exports.getCarByID = async (req, res) => {
    const carID = req.params.id;
    let car;
    try {
        car = await Car.findById(carID);
    } catch (err) {
        return res.status(400).json({ 'message': "Wrong ID", 'status': false });
    }

    if (!car) {
        return res.status(404).json({ 'message': "Car Not Found", 'status': false });
    }

    return res.status(200).json({ 'car': car, 'status': true });
}