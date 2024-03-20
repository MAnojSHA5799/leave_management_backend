const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const PORT = 4000;

app.use(bodyParser.json());

//-----------------------------This is Basic template------------------------------------------
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH,DELETE,HEAD"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-with, Content-Type,Accept"
    );
    next();
  });

//--------------------------------------------------------------------------

// Define your routes

//-----------------------------------------------------------------------------------

//DATABASE CONNECTION
let connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "Biltz123@",
    database: "biltz-data",
  });
connection.connect((err) => {
  if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
  }
  console.log('Connected to MySQL server');
});



// connection.query('SELECT * FROM employee', (error, results, fields) => {
//   if (error) {
//       console.error('Error executing query:', error);
//       return;
//   }
//   console.log('Query results:', results);
// });



app.post('/adminlogin', (req, res) => {
    console.log("1",req.body)
  const sql = "SELECT * FROM admin WHERE emailadmin = ? AND passwordadmin = ?"; 
  connection.query(sql, [req.body.name, req.body.password], (err, results) => {

    
    if (results.length > 0){
       console.log('3', results);
      return res.json({ success: true });
    } else {
   
      return res.status(401).json({ error: 'Incorrect username or password' });
    }
  });
});


// Endpoint for user login
// app.post('/adminlogin', (req, res) => {
//   const { username, password } = req.body;
  
//   connection.query('SELECT * FROM vishaldb_01.admin where username = ? AND password = ?', [username, password], (error, results) => {
//     if (error) {
//       console.log('result',results);
//       res.status(500).send('Error in database query');
//     } else {
//       if (results.length > 0) {
//         res.send('Login successful');
//       } else {
//         res.status(401).send('Invalid username or password');
//       }
//     }
//   });
// });












// app.get('/api/data', function(req, res, next) {
// 	connection.query('SELECT * FROM vishaldb_01.admin', function (error, results, fields) {
// 		if (error) throw error
//     {
//       console.log(results);
//     }
// 		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
// 	});
// });


// connection.end();



//------------------------------------------------------------------------------------------------------



//listen the port number for server 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
