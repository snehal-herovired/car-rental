const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { carRouter } = require('./routes/car-routes.js');
const { userRouter } = require('./routes/user-routes.js');


dotenv.config();

const app = express();
mongoose.connect(`mongodb+srv://car_rental_admin:${process.env.DB_PASSWORD}@cluster0.xiklfgh.mongodb.net/CarRental_App?retryWrites=true&w=majority`)
    .then(app.listen(process.env.PORT))
    .then(() => { console.log(`DB Connect & App Started at ${process.env.PORT}`) });


app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());


app.use('/api/cars/', carRouter);
app.use('/api/user', userRouter);


