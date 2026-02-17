const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true, minlength: 3},
    content: {type: String, required: true, minlength: 10},
    authorId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
},{timestamps: true})

module.exports = mongoose.model("Blog", blogSchema)