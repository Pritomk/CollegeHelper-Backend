const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    date: {
        type: String,
        required:true
    },
    status: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "class"
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student"
    }
});

const Attendance = mongoose.model("attendance", AttendanceSchema);
module.exports = Attendance;