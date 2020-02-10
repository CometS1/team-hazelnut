import mongoose from "mongoose";
import crypto from "crypto";
import dbConnection from "./../db/mongoose";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required"
    },
    email: {
      type: String,
      required: "Email is required",
      unique: "Email already exists"
    },
    token: {
      type: String
    },
    passwordHash: {
      type: String
    },
    salt: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

function generatePassword(salt, password) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 1000, 128, "sha512", (err, key) => {
      if (err) return reject(err);
      resolve(key.toString("hex"));
    });
  });
}

function generateSalt() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(128, (err, buffer) => {
      if (err) return reject(err);
      resolve(buffer.toString("hex"));
    });
  });
}

userSchema.methods.setPassword = async function setPassword(password) {
  this.salt = await generateSalt();
  this.passwordHash = await generatePassword(this.salt, password);
};

userSchema.methods.checkPassword = async function (password) {
  if (!password) return false;

  const hash = await generatePassword(this.salt, password);
  return hash === this.passwordHash;
};

userSchema.methods.generateToken = function(payload) {
  const secret = process.env.JWT_SECRET || "temp_secret_key";

  const token = jwt.sign(payload, secret, {
    expiresIn: 31556926
  });
  return token;
};

module.exports = dbConnection.model("User", userSchema);
