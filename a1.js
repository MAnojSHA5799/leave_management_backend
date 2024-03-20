// const { decryptData, encryptData } = require("./utility");
var express = require("express");
const cors = require("cors");
var mysql = require("mysql");
var app = express();
const { Client } = require("pg");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hey there");
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const { addListener } = require("nodemon");
const { application, response } = require("express");
// const { sendEMail } = require("./demo");

// var con = mysql.createConnection({
//   host: "127.0.0.1",
//   port: "3306",
//   user: "root",
//   password: "Biltz123@",
//   database: "biltz-data",
// });

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("success");
// });

// const con = new Client({
//   user: "postgres",
//   password: "Vishalsingh@2024",
//   database: "postgres",
//   port: 5432,
//   host: "db.syiryyyqefdfopqaggcx.supabase.co",
//   ssl: { rejectUnauthorized: false },
// });


const con = new Client({
    user: "postgres.syiryyyqefdfopqaggcx",
    password: "Vishalsingh@2024",
    database: "postgres",
    port: 5432,
    host: "aws-0-ap-southeast-1.pooler.supabase.com",
    ssl: { rejectUnauthorized: false },
  });
  



con.connect()
  .then(() => {
    console.log("Connected!!!");
  })
  .catch((error) => {
    console.error("Connection error:", error);
  });


  // Endpoint for user login
  app.post('/userlogin', (req, res) => {
    const { name, password } = req.body;
    connection.query('SELECT * from userdata where username = ? AND password = ?', [name, password], (error, results) => {
      if (error) {
        console.error('Error executing login query:', error);
        return res.status(500).json({ error: 'An error occurred while processing your request' });
      }
  
      if (results.length === 1) {
        
        console.log( results[0]);
        res.json({ success: true, user: results[0] });
      } else {
        // Login failed
        res.status(401).json({ success: false, error: 'Incorrect username or password' });
      }
    });
  });

  app.get('/userProfiles', (req, res) => {
    const sql = 'SELECT * FROM userdata;';
    con.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching user profiles:', err);
        res.status(500).json({ error: 'Error fetching user profiles' });
        return;
      }
      console.log(result)
      res.json(result);
    });
  });