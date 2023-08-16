const Database = require("../database/database");
class token {
  async accessToken(req, res, next) {
    if (req.headers.authorization == undefined) {
      return res.status(401).json({
        status: false,
        message: "Token not null",
      });
    }
    if(req.headers.authorization.split(" ")[0] != "Bearer" || req.headers.authorization.split(" ")[1] == undefined){
      return res.status(401).json({
         status: false,
         message: "Token not valid, must be Bearer token",
      });
      }
    const token = req.headers.authorization.split(" ")[1];
    
    
    const dbToken = await Database.GetFirst("SELECT * FROM access_token WHERE token = '" + token + "'");
    if (dbToken == undefined) {
      return res.status(401).json({
        status: false,
        message: "Token not valid",
      });
    }
    next();
  }
}

module.exports = new token();
