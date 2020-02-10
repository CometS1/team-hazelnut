const express = require("express");
const router = express.Router();

const Profile = require("../models/Profile");
const authenticate = require("./utils/auth");
const upload = require("../services/image-upload");

const singleUpload = upload.single("image");

router.post("/image-upload", authenticate, function(req, res, err) {
  singleUpload(req, res, async function(err) {
    if (err) {
      return res.status(422).send({
        errors: [{ title: "File Upload Error", detail: err.message }]
      });
    }

    let user = await Profile.find({ userId: req.user });
    if (user) {
      user[0].photoUrl = req.file.location;
      await user[0].save();
    } else {
      return res.status(404).send({ error: "User profile not found" });
    }

    return res.status(200).json({ imageUrl: req.file.location });
  });
});

module.exports = router;
