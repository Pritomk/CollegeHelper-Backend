const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const Student = require("../models/Student");
const Class = require("../models/Class");

router.get("/fetchallstudent", fetchuser, (req, res) => {
  Student.find({
    $and: [{ user: req.user.id }, { class: req.body.classId }],
  }).then((students) => {
    res.send(students);
  });
});

router.post(
  "/addstudent",
  fetchuser,
  [
    body("name", "Enter a valid name").isLength({ min: 2 }),
    body("roll", "Roll must be a number").isLength({
      min: 1,
    }),
  ],
  (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, roll, classId } = req.body;

    let student = new Student({
      name: name,
      roll: roll,
      user: req.user.id,
      class: classId,
    });

    student
      .save()
      .then((student) => {
        res.send(student);
      })
      .catch((err) => console.log(err));
  }
);

//Route 3 : Update student

router.put("/updatestudent/:id", fetchuser, async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);

    if (!student) {
      return res
        .status(400)
        .json({ success: false, msg: "Student is not exist" });
    }

    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      student,
      msg: "Successfully updated",
    });
  } catch (err) {
    console.log(err);
    res.send(422).json(err);
  }
});

//Route 4 : Delete student

router.delete('/deletestudent/:id', fetchuser, async (req, res)=> {
    try {
        let student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(422).json({error: "Student does not exist"});
        }

        student = await Student.findByIdAndDelete(req.params.id);

        res.status(200).json({msg: "Successfully deleted student"});
    } catch (err) {
        console.log(err);
        res.send(422).json({student,err: `Error is ${err.message}`});
      }
})

module.exports = router;
