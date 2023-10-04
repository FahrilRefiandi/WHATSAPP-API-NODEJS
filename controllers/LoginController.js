const Controllers = require("./Controllers");
const whatsapp = require("velixs-md");
const { toDataURL } = require("qrcode");
const Validator = require("validatorjs");

const Database = require("../database/database");

class Login extends Controllers{

    async login(req, res) {
        console.log("login");
        try {
            whatsapp.onQRUpdated(async (data) => {
                const qr = await toDataURL(data.qr);
                res.render("login", { qr: qr });
            });
            await whatsapp.startSession("sembarang", { printQR: false });
        } catch (err) {
          console.log(err.message);
          res.render("login", { qr: false });
        }
      }

      async index(req, res) {
        res.render("index");
      }

      async tes(req, res) {
        // print to browser
        res.send(
        await Database.GetAll("SELECT access_token.*,users.name,users.email FROM access_token JOIN users ON access_token.user_id = users.id")
        );
      }

      async delete(req,res){
        const rules = {
          session_id: "required",
        };
        const validation = new Validator(req.body, rules);
        if (validation.fails()) {
          return res.status(400).json({
            status: false,
            message: validation.errors.all(),
          });
        }
        
        try{
          await whatsapp.deleteSession(req.body.session_id);
        }catch(err){
          return res.status(400).json({
            status: false,
            message: err.message,
          });
        }

      }
    
}

module.exports = new Login();