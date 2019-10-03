import express from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import validator from "validator";
var router = express.Router();

router.post("/register", async function(req, res, next) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // first validate credentials
  if (!firstName) {
    res.status(400).json({ error: "First name is required" });
    next();
  }
  if (!lastName) {
    res.status(400).json({ error: "Last name is required" });
    next();
  }
  if (!email) {
    res.status(400).json({ error: "Email is required" });
    next();
  }
  if (!validator.isEmail(email)) {
    res.status(400).json({ error: "Incorrect email format" });
    next();
  }
  if (!password) {
    res.status(400).json({ error: "Password is required" });
    next();
  }
  if (password !== confirmPassword) {
    res.status(400).json({ error: "Passwords do not match" });
    next();
  }
  // regex to test if a string contains a number
  const regex = RegExp(".*\\d.*");

  if (!regex.test(password) || password.length < 8) {
    res.status(400).json({
      error:
        "Password has to contain a number and be at least 8 characters long"
    });
    next();
  }

  // if credentials are valid see if user already exists
  var user = await User.findOne({ email: email });
  if (user) {
    res.status(409).json({ error: "User already exists" });
    next();
  } else {
    user = new User({
      firstName,
      lastName,
      email
    });
  }

  // setPassword() is a function defined in the userSchema
  await user.setPassword(password);
  await user.save();

  res.status(200).json("message: Successfully registered!");
});

//login router

router.post("/login", async function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  var user = await User.findOne({ email: email });
  if (!user) {
    res.status(404).json({ error: "User not found" });
  }

  var validPass = await user.checkPassword(password);
  if (!validPass) {
    res.status(401).json({ error: "Password is incorrect" });
  }

  const payload = {
    id: user._id,
    name: user.firstName
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: 31556926
    },
    (err, token) => {
      res.json({
        token: "Bearer " + token
      });
    }
  );
});

module.exports = router;