const mongoose = require('mongoose');
const userShema = new mongoose.Schema({
    name: {
        type: string,
        required: true
    },
    email: {
        type: string,
        required: true
    },
    phone: {
        type: string,
        required: true
    },
    image: {
        type: string,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    }
});
module.exports = mongoose.model("user", userShema);