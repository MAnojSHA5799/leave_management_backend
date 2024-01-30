const { decryptData, encryptData } = require("./utility");
var express = require("express");
const cors = require("cors");
var mysql = require("mysql");
var app = express();
const { Client } = require("pg");
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
  password: "Biltz123@",
  database: "biltz-data",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("success");
});

// const con = new Client({
//   user: "postgres",
//   password: "Biltz123@990",
//   database: "postgres",
//   port: 5432,
//   host: "db.adbusyzbvzlgetciiwso.supabase.co",
//   ssl: { rejectUnauthorized: false },
// });

// con.connect()
//   .then(() => {
//     console.log("Connected!!!");
//   })
//   .catch((error) => {
//     console.error("Connection error:", error);
//   });

//Admin Page API
app.post(
  "/approved", function (req, res) {
    console.log(req.body);
    const Status = req.body.Status;  
    const id = req.body.id;      
          const query = `update holiday set Status="${Status}" where id="${id}"`;
          
          con.query(query, function (error, results) {
            if (error) throw error;
            return res.send({ status: 200, data: results, message: true});
          });
        }
    );

app.post("/admin", function (req, res) {
  console.log(req.body );
  const email = req.body.emailadmin.toLowerCase();
  const password = req.body.passwordadmin;
  con.query(
    `SELECT * FROM admin where emailadmin  like '${email}'`,
    function (error, results, fields) {
      if (error) throw error;
      console.log("80",{ results });
      if(results.length == 0){
        return res.send({ error: false, data: results, message: false });
      }
      const decryptedPassword = decryptData(results[0].passwordadmin);
      console.log("85",{ decryptedPassword });
      if (decryptedPassword === password) {
        const token = jwt.sign({ email: email },'KEY');
        return res.send({ error: false, data: results, message: true, token: token });
      }
      return res.send({ error: false, data: results, message: false });
    }
  );
});

app.post("/admindone", function (req, res) {
  console.log({ req });
  const token = req.body.token;
  const decoded = jwt.verify(token, 'KEY');
  const email = decoded.email;
  console.log({email})
  con.query(`SELECT * FROM holiday`, function (error, results, fields) {
    if (error) throw error;
    return res.send({ status: 200, data: results, });
  });
});

//Get API for holiday
app.post("/done", function (req, res) {
  console.log({ req });
  const token = req.body.token;
  const decoded = jwt.verify(token, 'KEY');
  const email = decoded.email;
  console.log({email})
  con.query(`SELECT * FROM holiday where email="${email}"`, function (error, results, fields) {
    if (error) throw error;
    return res.send({ status: 200, data: results, });
  });
});

//Post API for holiday
app.post('/mark',[
  body("leavetype", "Enter a valid name").isLength({ min: 2 }),
  body("name", "Enter a valid name").isLength({ min: 4 }),
  body("empcode", "Enter a valid empcode").isLength({ min: 5 }),
  body("startdate", "Enter a valid date").isDate(),
  body("enddate", "Enter a valid date").isDate(),
  body("email", "Enter a valid date").isEmail(),
  body("notes", "Enter a valid date").isLength({ min: 10 }),
], function (req, res){
  console.log(req.body)
  // const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({ errors: errors.array() });
  //   }
  console.log("117",req.body)
  const leavetype = req.body.leavetype;
  const name = req.body.name;
  const empcode = req.body.empcode;
  const startdate = req.body.startdate;
  const enddate = req.body.enddate;
  const email = req.body.email.toLowerCase();
  const notes = req.body.notes;
  const query = `INSERT INTO holiday (leavetype,name,empcode,startdate,enddate,email,notes) VALUES ( "${leavetype}","${name}", "${empcode}", "${startdate}", "${enddate}", "${email}","${notes}")`;
  con.query(query, function (err,results){
    if(err) throw err;
    return res.send({error: false, data: results, message: false});
  });
  // sendEMail(req.body);
});

//GET API

app.post("/datas", function (req, res) {
  console.log({ req });
  const email = req.body.emailr.toLowerCase();
  const password = req.body.passwordr;
  con.query(
    `SELECT * FROM detail where email like '${email}' `,
    function (error, results, fields) {
      if (error) throw error;
      console.log({ results });
      if(results.length == 0){
        return res.send({ error: false, data: results, message: false });
      }
      const decryptedPassword = decryptData(results[0].password);
      console.log({ decryptedPassword });
      if (decryptedPassword === password) {
        const token = jwt.sign({ email: email },'KEY');
        return res.send({ error: false, data: results, message: true, token: token });
      }
      return res.send({ error: false, data: results, message: false });
    }
  );
});

app.get("/datasas", function (req, res) {
  console.log({ req });
  con.query(`SELECT * FROM detail`, function (error, results, fields) {
    if (error) throw error;
    console.log({ results });
    results.forEach((data) => {
      data.password = decryptData(data.password);
    });
    return res.send({ status: 200, data: results, });
  });
});

//POST API

app.post(
  "/sign",
  [
    body("firstname", "Enter a valid email").isLength({min: 2}),
    body("lastname", "Enter a valid email").isLength({min: 2}),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 7 }),
    body("phonenumber", "Enter a valid email").isLength({min: 2}),
    body("dob", "Enter a valid email").isLength({min: 2}),
  ],
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email.toLowerCase();
    let password = req.body.password;
    password = encryptData(password);
    const phonenumber = req.body.phonenumber;
    const dob = req.body.dob;
    
    con.query(
      `SELECT * FROM detail where email='${email}' `,
      function (error, results, fields) {
        if(results.length>0){
          console.log("duplicate")
          return res.send({statusCode: 409, error: false, data: "duplicate", message: false }); 
        } else 
        {
          const query = `INSERT INTO detail (firstname,lastname,email,password,phonenumber,dob) VALUES ( "${firstname}","${lastname}","${email}", "${password}" ,${phonenumber},"${dob}")`;
          con.query(query, function (error, results) {
            console.log("no duplicate")
            if (error) throw error;
            return res.send({ status: 200, data: results, message: true});
          });
        }
      }
    );
  }
);