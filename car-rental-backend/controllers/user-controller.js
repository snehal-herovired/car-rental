const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();;



module.exports.getAllUsers = async (req, res) => {
    let users;
    try {
        users = await User.find({});
    } catch (err) {
        return console.log(err);
    }

    return res.status(200).json({ users });
}

module.exports.signUp = async (req, res) => {
    const { name, email, password, profile } = req.body;

    let exisitingUser;
    try {
        exisitingUser = await User.findOne({ 'email': email });
    } catch (err) {
        return console.log(err);
    }

    if (exisitingUser)
        return res.status(400).json({
            'message': 'User already exists with this email!',
            'email': 'false'
        });

    const hashedPassword = bcrypt.hashSync(password, 7);
    const user = new User({
        name,
        email,
        'password': hashedPassword,
        profile,
    });

    try {
        await user.save();
    } catch (err) {
        return console.log(err);
    }

    return res.status(200).json({
        'message': 'Account Created Successfully',
        'email': 'true'
    });
}


module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    let exisitingUser;
    try {
        exisitingUser = await User.findOne({ 'email': email });
    } catch (err) {
        return console.log(err);
    }

    if (!exisitingUser)
        return res.status(400).json({
            'message': 'Email not registered. Please Sign Up!!',
            'email': 'false',
            'password': 'false'
        });

    const isPasswordCorrect = bcrypt.compareSync(password, exisitingUser.password);

    if (!isPasswordCorrect)
        return res.status(400).json({
            'message': 'Password did not match, Try Again!!',
            'email': 'true',
            'password': 'false'
        });

    const token = jwt.sign({ id: exisitingUser._id }, process.env.JWT_SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: "5d"
    });

    //Clear Exisiting Cookies
    if (req.cookies) {
        for (key in req.cookies) {
            res.clearCookie(key);
        }
    }

    /*
    if (req.cookies[`${exisitingUser._id}`]) {
        req.cookies[`${exisitingUser._id}`] = ""
    }
    */

    res.cookie(String(exisitingUser._id), token, {
        path: '/',
        expires: new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000)),
        httpOnly: true,
        sameSite: "lax"
    });

    return res.status(200).json({
        'message': 'Login Successful',
        'email': 'true',
        'password': 'true'
    });
}

module.exports.getUser = async (req, res) => {
    const userID = req.id;
    let user;
    try {
        user = await User.findById(userID, "-password");
    } catch (err) {
        return console.log(err);
    }

    if (!user)
        return res.status(404).json({ 'message': 'User Not Found', 'status': 'invalid' });

    return res.status(200).json({ user })
}

module.exports.logoutUser = async (req, res) => {
    //const cookies = req.headers.cookie;

    if (req.cookies) {
        for (key in req.cookies) {
            res.clearCookie(key);
        }
    }

    return res.status(200).json({ message: 'Successfully Logged Out', logout: 'true' });
}


