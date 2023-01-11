const mongoose = require('mongoose');

const ClassSchema = mongoose.Schema({
    subject:{
        type: String,
        required: true
    },
    section:{
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});

const Class = mongoose.model('class', ClassSchema);
module.exports = Class;