const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Attendance = require("../models/Attendance");


// Fetch attendance for a particular student with particular class id
router.get(
  "/fetchattendance",
  fetchuser,
  [
    body("classId", "Enter a valid class id").isLength({ min: 5 }),
    body("studentId", "Enter a valid student id").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { classId, studentId } = req.body;
    console.log(classId+studentId);
    try {
      let attendances = await Attendance.find({
        $and: [{ user: req.user.id }, { class: classId }, { student: studentId }],
      });

      res.send(attendances);
  
    }catch(err) {
        console.log(err.message);
        res.send(err);
    }

  }
);

//Fetch attendance for particular class for a specific date 
router.get(
  "/fetchattendance/:date",
  fetchuser,
  [
    body("classId", "Enter a valid class id").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { classId, studentId } = req.body;
    console.log(classId+studentId);
    try {
      let attendances = await Attendance.find({
        $and: [{ user: req.user.id }, { class: classId }, { date: req.params.date }],
      });

      res.send(attendances);
  
    }catch(err) {
        console.log(err.message);
        res.send(err);
    }

  }
);

//Route 2 : Insert json array into mongodb database
//How to insert json array into mongodb database?
router.post('/addattendance', fetchuser, async (req,res)=>{
    try {
        let array = req.body;
        array = await Attendance.insertMany(array);
        res.send(array);    
    }catch(err) {
        console.log(err.message);
        res.send(err);
    }
})


module.exports = router;
