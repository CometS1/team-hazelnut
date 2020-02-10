import Profile from "../models/Profile";
import mongoose from "mongoose";

const validateProfileInput = require("../validator/profile-validator")

// Handle profile create on POST
module.exports.createProfile = function (req, res, next) {

  const { errors, isValid } = validateProfileInput(req.body);
  if (!isValid) { return res.status(400).json(errors); }

  const user = req.body;
  user.userId = req.user;
  const profile = new Profile(user);

  profile.save(function (err, profile) {
    if (err) return next(err);
    res.status(200).json(profile);
  });

};

// Handles profile updates on POST
module.exports.updateProfile = function (req, res, next) {

  const { errors, isValid } = validateProfileInput(req.body);
  if (!isValid) { return res.status(400).json(errors); }

  Profile.findOne({ userId: req.params.id }, function (err, profile) {

    if (err) { return next(err); }
    for (const key of Object.keys(req.body)) { profile[key] = req.body[key]; }

    profile.save(function (err, profile) {
      if (err) return next(err);
      res.status(200).json(profile);
    });

  });
};

// GET a specific profile
module.exports.getProfile = async function (req, res, next) {

  if (mongoose.Types.ObjectId.isValid(req.params.id)) {

    Profile.findOne({ userId: req.params.id }, (err, profile) => {
      if (!profile) { res.status(404).json({ error: err }); }
      else if (err) { res.status(500).json({ error: err }); }
      else { res.status(200).json({ profile }); }
    });

  } else { res.status(404).json({ error: "Invalid user ID" }); }

};

// GET all profiles
module.exports.getAllProfiles = async function (req, res, next) {

  Profile.find({}, (err, profiles) => {
    if (err) { res.status(404).json({ error: "No profiles found" }); }
    else { res.status(200).json({ profile: profiles }); }
  });

};
