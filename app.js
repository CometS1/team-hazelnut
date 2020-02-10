import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "passport";
import cors from "cors";

import indexRouter from "./routes/index";
import profileRouter from "./routes/profile";
import photoRouter from "./routes/photo";
import usersRouter from "./routes/users";
import fileUploadRouter from "./routes/file-upload";
import paymentRouter from "./routes/payment";
import conversationRouter from "./routes/conversation";

var app = express();
const path = require("path")

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")));

app.use(passport.initialize());
require("./libs/passport")(passport);

app.use("/", indexRouter);
app.use("/profile", profileRouter);
app.use("/profile-photo", photoRouter);
app.use("/users", usersRouter);
app.use("/files", fileUploadRouter);
app.use("/profile-payment", paymentRouter);
app.use("/conversation", conversationRouter);

app.use(cors());

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // Only provides error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen();
module.exports = app;
