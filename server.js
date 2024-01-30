const { decryptData, encryptData } = require("./utility");
var express = require("express");
const cors = require("cors");
var mysql = require("mysql");
var app = express();
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hey there");
});

app.listen(5000, function () {
  console.log("App is listening at 5000 port");
});

const { addListener } = require("nodemon");
const { application, response } = require("express");
const { sendEMail } = require("./demo");

var con = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "",
  database: "data",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("success");
});

//Admin Page API
