const mongoose = require("mongoose");
const Schema = mongoose.Schema;
import dbConnection from "./../db/mongoose";

const ConversationSchema = new Schema(
    {
        members :  [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    }
);

module.exports = dbConnection.model("Conversation", ConversationSchema);