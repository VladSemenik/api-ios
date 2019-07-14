const express = require('express');
const routes = require('./routes');
const dotenv = require('dotenv');
const mysql = require('mysql');


const con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

dotenv.config();


const app = express();


//middleware
app.use(express.json());
app.use(routes);

app.listen(9000, () => console.log('Listening on port 9000.'));