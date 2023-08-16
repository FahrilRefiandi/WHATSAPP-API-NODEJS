const whatsapp = require("velixs-md");

class checkSession {
  check(sessionId) {
    console.log(whatsapp.getSession(sessionId));
    
  }
}

module.exports = new checkSession();
