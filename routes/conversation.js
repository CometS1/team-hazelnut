var express = require("express");
var router = express.Router();
const authenticate = require("./utils/auth");

var conversation_controller = require("../controllers/conversationController");


router.get("/list", authenticate, conversation_controller.getConversations);
router.get("/:conversation_id", authenticate, conversation_controller.getMessages);
router.post("/", authenticate, conversation_controller.createConversation);
router.post("/:conversation_id/message", authenticate, conversation_controller.createMessage);
router.delete("/delete/:conversation_id", authenticate, conversation_controller.deleteConversation);

module.exports = router;    