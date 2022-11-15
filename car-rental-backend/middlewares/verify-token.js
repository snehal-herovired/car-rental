const jwt = require('jsonwebtoken');
require('dotenv').config();;


module.exports.verifyToken = async (req, res, next) => {
    const cookies = req.headers.cookie;
    //console.log(cookies);
    if (!cookies)
        return res.status(400).json({ message: "Token has Expired. Re-login" });

    const token = cookies.split("=")[1]

    if (!token)
        return res.status(404).json({ message: "No token found" });

    jwt.verify(String(token), process.env.JWT_SECRET_KEY, (error, userToken) => {
        if (error) {
            return res.status(400).json({ 'message': 'Invalid Token' });
        }
        if (userToken) {
            //console.log(user.id);
            req.id = userToken.id
        }
    });

    next();
}