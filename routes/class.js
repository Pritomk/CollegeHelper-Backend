const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Class = require("../models/Class");
const { body, validationResult } = require("express-validator");

//Route 1 : Add class
router.get("/fetchallclass", fetchuser, (req, res) => {
  Class.find({ user: req.user.id })
    .then((classes) => {
      res.send(classes);
    })
    .catch((err) => console.log(err));
});

//Route 2 : Add class to database

router.post(
  "/addclass",
  fetchuser,
  [
    body("subject", "Enter a valid subject").isLength({ min: 2 }),
    body("section", "Enter a valid subject").isLength({
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

    const { subject, section } = req.body;

    let _class = new Class({
      subject: subject,
      section: section,
      user: req.user.id,
    });

    _class
      .save()
      .then((_class) => {
        return res.send(_class);
      })
      .catch((err) => console.log(err));
  }
);

//Route 3 : Update class

router.put("/updateclass/:id",fetchuser ,async (req, res) => {
    try {
        let _class = await Class.findById(req.params.id);

        if (!_class) {
          return res.status(400).json({ success: false, msg: "Class is not exist" });
        }
      
        _class = await Class.findByIdAndUpdate(req.params.id, req.body, {
          new : true,
          runValidators: true
        });
      
        res.status(200).json({
          _class,
          msg: "Successfully updated"
        });
      
    } catch(err) {
        console.log(err);
        res.send(422).json(err);
    }
});


//Router 4 : Delete class from database

router.delete('/deleteclass/:id', fetchuser, async (req,res)=> {
    try {
        let _class = await Class.findById(req.params.id);

        if (!_class) {
            return res.status(400).json({ success: false, msg: "Note is not exist" });
          }

        if (_class.user.toString() !== req.user.id) {
            return res.status(422).json({error: "It's not your note"});
        }

        _class = await Class.findByIdAndDelete(req.params.id);

        return res.status(200).json({_class,msg: "Successfully deleted"});

    } catch(err){
        console.log(err);
        res.send(422).json(err);
    }
})

module.exports = router;