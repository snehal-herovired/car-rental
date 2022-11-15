const express = require('express');
const userRouter = express.Router();
const { getAllUsers, signUp, loginUser, getUser, logoutUser } = require('../controllers/user-controller.js');
const { verifyToken } = require('../middlewares/verify-token.js');

userRouter.get('/', getAllUsers);
userRouter.post('/signup', signUp);
userRouter.post('/login', loginUser);
userRouter.get('/user', verifyToken, getUser);
userRouter.get("/logout", logoutUser);


module.exports.userRouter = userRouter;