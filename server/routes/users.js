import express from "express";
import User from "../models/User";
import validator from "validator";
import requestsController from "../controllers/requestsController";
import authenticate from "../routes/utils/auth";
var router = express.Router();

router.post("/register", async function(req, res, next) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // first validate credentials
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Incorrect email format" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }
  // regex to test if a string contains a number
  const regex = RegExp(".*\\d.*");

  if (!regex.test(password) || password.length < 8) {
    return res.status(400).json({
      error:
        "Password has to contain a number and be at least 8 characters long"
    });
  }

  // if credentials are valid see if user already exists
  var user = await User.findOne({ email: email });
  if (user) {
    return res.status(409).json({ error: "User already exists" });
  } else {
    user = new User({
      name,
      email
    });
  }

  // setPassword() is a function defined in the userSchema
  await user.setPassword(password);
  await user.save();

  // now login the user
  const payload = {
    id: user._id,
    name: user.name
  };

  const token = user.generateToken(payload);

  if (token) {
    res.status(200).json({ token });
  } else {
    res.status(401).json({ error: "Login failed" });
  }
});

//login router

router.post("/login", async function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  var user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  var validPass = await user.checkPassword(password);
  if (!validPass) {
    return res.status(401).json({ error: "Password is incorrect" });
  }

  const payload = {
    id: user._id,
    name: user.name
  };

  const token = user.generateToken(payload);

  if (token) {
    res.status(200).json({ token });
  } else {
    res.status(401).json({ error: "Login failed" });
  }
});

router.post("/sendRequest", authenticate, requestsController.createRequest);
router.post("/updateRequest", authenticate, requestsController.updateRequest);
router.get("/getRequests", authenticate, requestsController.getRequests);
router.get("/getRequested", authenticate, requestsController.getRequested);
router.get("/getRequestsWithProfile", authenticate, requestsController.getRequestsWithProfile);
router.get("/getRequestedWithProfile", authenticate, requestsController.getRequestedWithProfile);

module.exports = router;
