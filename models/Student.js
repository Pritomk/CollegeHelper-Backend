const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roll: {
        type: Number,
        reuqired: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "class"
    }
});

const Student = mongoose.model("student", StudentSchema);
module.exports = Student;