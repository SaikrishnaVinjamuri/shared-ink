const mongoose = require('mongoose')

const  refreshToken = new mongoose.Schema({
    token: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true, unique: true},
    createdAt: {type: Date, default: Date.now, expires: 7*24*60*60 }
})

module.exports = mongoose.model('RefreshToken', refreshToken) 