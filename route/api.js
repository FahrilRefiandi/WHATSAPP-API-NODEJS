const express = require("express");
const router = express.Router();
const token = require("../middleware/token");
const messageController = require("../controllers/messageController");
router.use(token.accessToken);

router.post("/send-message", messageController.message);

module.exports = router;
