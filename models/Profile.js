const mongoose = require("mongoose");
const Schema = mongoose.Schema;
import dbConnection from "./../db/mongoose";

const ProfileSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  photoUrl: {
    type: String
  },
  gender: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  birthDate: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  address: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = dbConnection.model("Profile", ProfileSchema);
