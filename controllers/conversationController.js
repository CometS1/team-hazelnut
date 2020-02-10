import Conversation from "../models/Conversation";
import Message from "../models/Message";
import Profile from "../models/Profile";

const ObjectId = require("mongodb").ObjectID;

// POST a conversation (new conversation)
module.exports.createConversation = function(req, res, next) {
    Profile.findOne({ userId: req.body.recipientId }, function(err, recipient) {
        if (err) return next(err);
        const conversation = new Conversation({
            members: [ObjectId(req.user), ObjectId(recipient.userId)]
        });
        
        if (!conversation.members) {
            return res.status(400).json({ message: "Please select recipient"});
        } else {
            Conversation.findOne({ 
                members: [ObjectId(req.user), ObjectId(recipient.userId)]
            }, function(err, duplicate) {
                if (err) {
                    console.log(err);
                } else if (duplicate) {
                    console.log("The conversation already exists");
                } else {
                    Conversation.findOne({
                        members: [ObjectId(recipient.userId), ObjectId(req.user)]
                    }, function(err, dup){
                        if (err) {
                            console.log(err);
                        } else if (dup) {
                            console.log("The conversation already exists");
                        } else {
                            conversation.save(function(err, conversation) {
                                if (err) return next(err);
                                res.json(conversation);
                            });
                        }
                    });
                }
            });
        }
    });
};


// GET list of conversations and both user and recipient's profiles
module.exports.getConversations = function(req, res, next) {
    Conversation.aggregate([
        {
            $match: { members: ObjectId(req.user) }
        },
        { 
            $unwind: "$members" 
        },
        {
            $lookup: {
                from: "profiles",
                localField: "members",
                foreignField: "userId",
                as: "members_info"
            }
        },
        {
            $unwind: "$members_info"
        },
        {
            $group: {
                _id: "$_id",
                members: { $push: "$members"},
                members_info: { $push: "$members_info"}
            }
        }
    ], function(err, conversations) {
        if (err) return next(err);
        res.json(conversations);
    });
};


// POST /conversation/:conversation_id/message (new message)
module.exports.createMessage = function(req, res, next) {
    const message = new Message({
        conversationId: req.body.conversationId,
        userId : req.user,
        body: req.body.body
    });
    if (message.conversationId && message.body) {
        message.save(function(err, conversation){
            if (err) return next(err);
            res.json(conversation);
        });
    } else {
        return res.status(400).json({ message: "Please enter conversationId and message"});
    }
};


// GET /conversation/:conversation_id (body list of messages sent already)
module.exports.getMessages = function(req, res, next) {
    Message.find({conversationId: req.params.conversation_id})
        .populate("conversationId", "members")
        .populate("userId", "name")
        .exec(function(err, courses){
            if(err) return next(err);
            res.json(courses);
        });
};


// DELETE /conversation/:conversation_id 
module.exports.deleteConversation = function(req, res, next) {
    Conversation.remove({ _id: req.params.conversation_id}, function(err, conversation){
        if (err) return next(err);
        res.json({ message: "successfully deleted" });
    });
  }

