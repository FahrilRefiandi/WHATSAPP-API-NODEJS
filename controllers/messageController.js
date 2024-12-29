const Controller = require("./Controllers");
const Validator = require("validatorjs");
const whatsapp = require("velixs-md");
const fs = require("fs");
const { default: axios } = require("axios");
const { log } = require("console");

// const checkSession = require("../helpers/checkSession");

class sendMessage extends Controller {
  message = async (req, res) => {
    const rules = {
      message_type: "required|in:text,image,audio,video,document",
      message: "required",
      received: "required",
      session_id: "required",
      file: "required_if:message_type,image,audio,video,document",
    };
    const validation = new Validator(req.body, rules);
    // jika berupa array
    if (Array.isArray(req.body.received)) {
      //
      for (let i = 0; i < req.body.received.length; i++) {
        if (new Validator({ received: req.body.received[i] }, { received: ["required", "regex:/^62[0-9]{9,12}$/"] }).fails()) {
          return res.status(400).json({
            status: false,
            message: "received must be an array of phone numbers",
          });
        }
      }
    } else {
      req.body.received = [req.body.received];
    }
    
    

    if (validation.fails()) {
      return res.status(400).json({
        status: false,
        message: validation.errors.all(),
      });
    }

    if (req.body.message_type === "text") {
      this.sendText(req.body.message, req.body.received, req.body.session_id, res);
    } else if (req.body.message_type === "image") {
      this.sendImage(req.body.message, req.body.file, req.body.received, req.body.session_id, res);
    } else if (req.body.message_type === "document") {
      this.sendDocument(req.body.message, req.body.file, req.body.received, req.body.session_id, req.body.filename, res);
    } else {
      return res.status(400).json({
        status: false,
        message: "message type not found",
      });
    }
  };

  sendText = async (message, received, session_id, res) => {
    try {
      for (let i = 0; i < received.length; i++) {
        whatsapp.sendTextMessage({
          sessionId: session_id,
          to: received[i],
          text: message,
        });
      }
      res.status(200).json({
        status: true,
        message: "message send to " + received,
      });
    } catch (error) {
      console.error("Error sending text:", error);
    }
  };

  sendImage = async (message, file, received, session_id, res) => {
    try {
      for (let i = 0; i < received.length; i++) {
        await whatsapp.sendImage({
          sessionId: session_id,
          to: received[i],
          text: message,
          media: file,
        });
      } 

      
      
      res.status(200).json({
        status: true,
        message: "message send to " + received,
      });
    } catch (error) {
      console.error("Error sending text:", error);
    }
  };

  sendDocument = async (message, file, received, session_id, filename = file.split("/").pop(), res) => {
    try {
      let doc = await axios.get(file, {
        responseType: "arraybuffer",
      });
      for (let i = 0; i < received.length; i++) {
        whatsapp.sendDocument({
          sessionId: session_id,
          to: received[i],
          text: message,
          media: doc.data,
          filename: filename,
        });
      }
      
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
