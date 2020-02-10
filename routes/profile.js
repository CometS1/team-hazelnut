var express = require("express");
var router = express.Router();
const authenticate = require("./utils/auth");

var profile_controller = require("../controllers/profileController");

router.post("/create", authenticate, profile_controller.createProfile);
router.get("/get", authenticate, profile_controller.getAllProfiles);
router.get("/get/:id", authenticate, profile_controller.getProfile);
router.put("/update/:id", authenticate, profile_controller.updateProfile);

module.exports = router;
