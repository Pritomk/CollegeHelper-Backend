const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");

//For temporary purpose

router.get('/alluser',async (req,res) => {
	const users = await User.find({});
	return res.status(200).json(users);
})

router.post(
  "/register",
  [
    body("name", "Name is too short").isLength({ min: 3 }),
    body("email", "Email is not valid").isEmail(),
    body("password", "Password is too short").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const { name, email, password } = req.body;
      console.log(name+email+password);

      let savedUser = await User.findOne({ email: email });
      if (savedUser) {
        return res.status(400).json({
          error: "User already exist",
        });
      }

      let salt = await bcryptjs.genSalt(12);
      let hashedPassword = await bcryptjs.hash(password, salt);

      let user = new User({ name, email, password: hashedPassword });
      let newUser = await user.save();
      let authToken = jwt.sign({ _id: newUser.id }, JWT_SECRET);

	
      res.status(200).json({
        success: true,
        user:{name,email},
        token: authToken,
      });
    } catch (err) {
      res.status(500).json({ error: `Internal server error: ${err.message}` });
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Email is not valid").isEmail(),
    body("password", "Password is too short").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }
	try {
		const { email, password } = req.body;
    console.log(email+password);

		const existingUser = await User.findOne({email: email});
	
		if (!existingUser) {
		  return res.status(422).json({ error: "Login with correct credentials" });
		}
	
		const matched = await bcryptjs.compare(password, existingUser.password);
	
		if (!matched) {
		  return res.status(422).json({ error: "Login with correct credentials" });
		}
		
		const user = await User.findOne({email: email}).select("-password");

	
		const authToken = jwt.sign({_id: existingUser.id}, JWT_SECRET);
		return res.status(200).json({
			user,
			token: authToken,
		  });
	
	} catch(err) {
		res.status(500).json({ error: `Internal server error: ${err.message}` });

	}
  }
);

router.get("/getuser", fetchuser, async (req,res)=> {
	return res.send(req.user);
})

module.exports = router;
