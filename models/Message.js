const mongoose = require("mongoose");
const Schema = mongoose.Schema;
import dbConnection from "./../db/mongoose";

const MessageSchema = new Schema(
    {
        conversationId :  {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation"
        },
        userId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        body : {
            type: String
        },
        createdAt : {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = dbConnection.model("Message", MessageSchema);