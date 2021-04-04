const mongoose = require("mongoose");

const post_schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    blog: {
        type: String,
        required: true
    },
    owner: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model("Blog", post_schema);