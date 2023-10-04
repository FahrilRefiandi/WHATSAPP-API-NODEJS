const express = require("express");
const router = express.Router();
const token = require("../middleware/token");
const messageController = require("../controllers/messageController");
const LoginController = require("../controllers/LoginController");
router.use(token.accessToken);

router.post("/send-message", messageController.message);
router.post("/delete-session", LoginController.delete);

module.exports = router;
