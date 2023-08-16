const Controller = require("./Controllers");
const Validator = require("validatorjs");
const whatsapp = require("velixs-md");

// const checkSession = require("../helpers/checkSession");

class sendMessage extends Controller {
  message = async (req, res) => {
    const rules = {
      message_type: "required|in:text,image,audio,video,document",
      message: "required",
      received: ["required", "string", "regex:/^62[0-9]{9,12}$/"],
      session_id: "required",
      file: "required_if:message_type,image,audio,video,document",
    };
    const validation = new Validator(req.body, rules);
    if (validation.fails()) {
      return res.status(400).json({
        status: false,
        message: validation.errors.all(),
      });
    }

    // req.body.received="6285174902345";

    if (req.body.message_type === "text") {
      this.sendText(req.body.message, req.body.received, req.body.session_id, res);
    } else if (req.body.message_type === "image") {
      this.sendImage(req.body.message,req.body.file, req.body.received, req.body.session_id, res);
    } else {
      return res.status(400).json({
        status: false,
        message: "message type not found",
      });
    }
  };

  sendText = async (message, received, session_id, res) => {
    try {
      whatsapp.sendTextMessage({
        sessionId: session_id,
        to: received,
        text: message,
      });
      res.status(200).json({
        status: true,
        message: "message send to " + received ,
      });
    } catch (error) {
      console.error("Error sending text:", error);
    }
  };

  sendImage = async (message,file, received, session_id, res) => {
    try {
      whatsapp.sendImage({
        sessionId: session_id,
        to: received,
        text: message,
        media: file, // can from URL too
      });
      res.status(200).json({
        status: true,
        message: "message send to " + received,
      });
    } catch (error) {
      console.error("Error sending text:", error);
    }
  };
}

module.exports = new sendMessage();


