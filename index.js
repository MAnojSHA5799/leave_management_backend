const { decryptData, encryptData } = require("./utility");
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

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const { addListener } = require("nodemon");
const { application, response } = require("express");
const { sendEMail } = require("./demo");

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

const con = new Client({
  user: "postgres.adbusyzbvzlgetciiwso",
  password: "Biltz123@990",
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

//Admin Page API

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'manojshakya78605@gmail.com',
    pass: 'tzdc dhsi rsfu hgdr'
  },
});

app.post("/approved", function (req, res) {
  // console.log(req.body);
  const { Status, id, item,userdata } = req.body;
  const query = `UPDATE holiday SET Status=$1 WHERE id=$2`;

  con.query(query, [Status, id], function (error, results) {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).send({ status: 500, error: true, message: "Internal Server Error" });
    }

    // Check if the status is "Approved" or "Deny"
    if (Status === "Approved" || Status === "Deny") {
      // Send email
      const mailOptions = {
        from: 'manojshakya78605@gmail.com',
        to: item,
        subject: 'Approval Status Update',
        text: `The status for holiday with ID ${id} has been updated to ${Status}. \n\nLeave Details:\nType: ${userdata.leavetype}\nName: ${userdata.name}\nEmployee Code: ${userdata.empcode}\nStart Date: ${userdata.startdate}\nEnd Date: ${userdata.enddate}\nNotes: ${userdata.notes}`,
  
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }

    return res.send({ status: 200, data: results, message: true });
  });
});

// app.post("/approved", function (req, res) {
//   console.log(req.body)
//   const { Status, id,item } = req.body;
//   const query = `update holiday SET Status=$1 WHERE id=$2`;
//   con.query(query, [Status, id], function (error, results) {
//     if (error) {
//       console.error("Error executing query:", error);
//       return res.status(500).send({ status: 500, error: true, message: "Internal Server Error" });
//     }

//     return res.send({ status: 200, data: results, message: true });
//   });
// });





    app.post("/admin", function (req, res) {
      const email = req.body.emailadmin.toLowerCase();
      const password = req.body.passwordadmin;
      
      con.query(
        'SELECT * FROM admin WHERE emailadmin LIKE $1',
        [email],
        function (error, result, fields) {
          if (error) {
            console.error("Error executing query:", error);
            return res.status(500).send({ error: true, message: "Internal Server Error" });
          }
    
          
          if (result.rows.length === 0) {
            return res.send({ error: false, data: result.rows, message: false });
          }
    
          const decryptedPassword = result.rows[0].passwordadmin ? decryptData(result.rows[0].passwordadmin) : null;
    
          console.log("85", { decryptedPassword });
    
          if (decryptedPassword && decryptedPassword === password) {
            const token = jwt.sign({ email: email }, 'KEY');
            return res.send({ error: false, data: result.rows, message: true, token: token });
          }
    
          return res.send({ error: false, data: result.rows, message: false });
        }
      );
    });
    

    app.post("/admindone", function (req, res) {
      const token = req.body.token;
      try {
        const decoded = jwt.verify(token, 'KEY');
        const email = decoded.email;
    
        con.query(`SELECT * FROM holiday`, function (error, results, fields) {
          if (error) {
            console.error("Error executing query:", error);
            return res.status(500).send({ status: 500, error: true, message: "Internal Server Error" });
          }
          return res.send({ status: 200, data: results.rows });
        });
      } catch (jwtError) {
        console.error("JWT verification error:", jwtError);
        return res.status(401).send({ status: 401, error: true, message: "Unauthorized" });
      }
    });
    

//Get API for holiday
const jwtSecretKey = process.env.JWT_SECRET_KEY || 'default-secret-key'; // Use environment variable or a default key

// app.post("/done", function (req, res) {
//   try {
//     const token = req.body.token;
// console.log("140",token)
//     // Verify the token and get the decoded email
//     const decoded = jwt.verify(token, 'KEY');
//     const email = decoded.email;

//     console.log({ email });

//     // Use parameterized query to prevent SQL injection
//     con.query('SELECT * FROM holiday WHERE email = $1', [email], function (error, result, fields) {
//       console.log("149",result)
//       if (error) {
//         console.error("Error executing query:", error);
//         return res.status(500).send({ error: true, message: "Internal Server Error" });
//       }
//       console.log("154",result.rows)
//       return res.status(200).send({ status: 200, data: result.rows });
      
//     });
//   } catch (err) {
//     console.error("Error verifying token:", err);
//     return res.status(401).send({ error: true, message: "Unauthorized or Invalid Token" });
//   }
// });
app.post("/done", function (req, res) {
  const token = req.body.token;
  const decoded = jwt.verify(token, 'KEY');
  const email = decoded.email;
  con.query(`SELECT * FROM holiday where email= $1 `, [email], function (error, results, fields) {
    if (error) throw error;
    return res.send({ status: 200, data: results.rows, });
  });
});

//Post API for holiday


// app.post('/mark', [
//   body("leavetype", "Enter a valid name").isLength({ min: 2 }),
//   body("name", "Enter a valid name").isLength({ min: 4 }),
//   body("empcode", "Enter a valid empcode").isLength({ min: 5 }),
//   body("startdate", "Enter a valid date").isDate(),
//   body("enddate", "Enter a valid date").isDate(),
//   body("email", "Enter a valid email").isEmail(),
//   body("notes", "Enter a valid note").isLength({ min: 10 })
// ], function (req, res) {
//   // const errors = validationResult(req);
//   // if (!errors.isEmpty()) {
//   //   return res.status(400).json({ errors: errors.array() });
//   // }

//   const leavetype = req.body.leavetype;
//   const name = req.body.name;
//   const empcode = req.body.empcode;
//   const startdate = req.body.startdate;
//   const enddate = req.body.enddate;
//   const email = req.body.email.toLowerCase();
//   const notes = req.body.notes;

//   const query = 'INSERT INTO holiday (leavetype, name, empcode, startdate, enddate, email, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)';
//   con.query(query, [leavetype, name, empcode, startdate, enddate, email, notes], function (err, results) {
//     if (err) {
//       console.error("Error executing query:", err);
//       return res.status(500).send({ error: true, message: "Internal Server Error" });
//     }
//     return res.send({ error: false, data: results, message: false });
//   });
// });


app.post('/mark', [
   body("leavetype", "Enter a valid name").isLength({ min: 2 }),
  body("name", "Enter a valid name").isLength({ min: 4 }),
  body("empcode", "Enter a valid empcode").isLength({ min: 5 }),
  body("startdate", "Enter a valid date").isDate(),
  body("enddate", "Enter a valid date").isDate(),
  body("email", "Enter a valid email").isEmail(),
  body("notes", "Enter a valid note").isLength({ min: 10 })
], async function (req, res) {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
console.log(req.body)
  const leavetype = req.body.leavetype;
  const name = req.body.name;
  const empcode = req.body.empcode;
  const startdate = req.body.startdate;
  const enddate = req.body.enddate;
  const email = req.body.email.toLowerCase();
  const notes = req.body.notes;

  const query = 'INSERT INTO holiday (leavetype, name, empcode, startdate, enddate, email, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)';
  con.query(query, [leavetype, name, empcode, startdate, enddate, email, notes], async function (err, results) {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send({ error: true, message: "Internal Server Error" });
    }

    // Send email using Nodemailer
    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail', // e.g., 'gmail'
        auth: {
          user: 'manojshakya78605@gmail.com',
          pass: 'tzdc dhsi rsfu hgdr'
        }
      });

      const mailOptions = {
        from: 'manojshakya78605@gmail.com',
        to: email,
        subject: 'Leave Request Confirmation',
        text: `Your leave request has been successfully submitted.\n\nLeave Details:\nType: ${leavetype}\nName: ${name}\nEmployee Code: ${empcode}\nStart Date: ${startdate}\nEnd Date: ${enddate}\nNotes: ${notes}`
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.response);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    return res.send({ error: false, data: results, message: 'Leave request submitted successfully.' });
  });
});


//GET API

app.post("/datas", function (req, res) {
  const email = req.body.emailr.toLowerCase();
  const password = req.body.passwordr;

  con.query(
    'SELECT * FROM detail WHERE email LIKE $1',
    [email],
    function (error, results, fields) {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).send({ error: true, message: "Internal Server Error" });
      }


      if (results.rows.length === 0) {
        return res.send({ error: false, data: results.rows, message: false });
      }

      const decryptedPassword = results.rows[0].password ? decryptData(results.rows[0].password) : null;

      console.log({ decryptedPassword });

      if (decryptedPassword === password) {
        const token = jwt.sign({ email: email }, 'KEY');
        return res.send({ error: false, data: results.rows, message: true, token: token });
      }

      return res.send({ error: false, data: results, message: false });
    }
  );
});



app.get("/datasas", function (req, res) {
  con.query("SELECT * FROM detail", function (error, results, fields) {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).send({ error: true, message: "Internal Server Error" });
    }


    // Decrypt the password field for each resul
console.log("244",results.rows)
    return res.status(200).send({ data: results.rows });
  });
});


//POST API

app.post(
  "/sign",
  [
    body("firstname", "First name must be at least 2 characters long").isLength({ min: 2 }),
    body("lastname", "Last name must be at least 2 characters long").isLength({ min: 2 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 7 characters long").isLength({ min: 7 }),
    body("phonenumber", "Phone number must be at least 2 characters long").isLength({ min: 2 }),
    body("dob", "Date of birth must be at least 2 characters long").isLength({ min: 2 }),
  ],
  function (req, res) {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email.toLowerCase();
    const password = encryptData(req.body.password);
    const phonenumber = req.body.phonenumber;
    const dob = req.body.dob;

    // Check if email is already registered
    con.query(
      'SELECT * FROM detail WHERE email = $1',
      [email],
      function (error, results) {
        if (error) {
          console.error("Error checking duplicate email:", error);
          return res.status(500).json({ error: true, message: "Internal Server Error" });
        }

        if (results.length > 0) {
          console.log("Duplicate email");
          return res.json({ statusCode: 409, error: false, data: "duplicate", message: false });
        } else {
          // Insert new user
          const query = 'INSERT INTO detail (firstname, lastname, email, password, phonenumber, dob) VALUES ($1, $2, $3, $4, $5, $6)';
          const values = [firstname, lastname, email, password, phonenumber, dob];

          con.query(query, values, function (error, results) {
            if (error) {
              console.error("Error inserting new user:", error);
              return res.status(500).json({ error: true, message: "Internal Server Error" });
            }

            console.log("User registered successfully");
            return res.json({ status: 200, data: results, message: true });
          });
        }
      }
    );
  }
);