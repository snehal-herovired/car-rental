const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    profile: {
        type: String,
        enum: ['admin', 'owner', 'customer'],
        required: true,
    },
    wallet: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;