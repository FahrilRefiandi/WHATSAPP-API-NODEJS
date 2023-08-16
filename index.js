// const database = require("./database/database");
const whatsapp = require("velixs-md");
whatsapp.startSession("sembarang");
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));






const ApiRoute = require("./route/api");
const WebRoute = require("./route/web");

app.use("/api", ApiRoute); 
app.use("/", WebRoute);    


app.listen(3000, () => {
  // buat agar url bisa diklik
  console.log("Server running on port http://localhost:3000");

});
