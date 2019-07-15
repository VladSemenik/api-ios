const router= require('express').Router();
const mysql = require('mysql');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

//models
const User = require('../model/User');
//validation
const { registerValidation, loginValidation } = require('../validation');




const con = mysql.createConnection({
  host: process.env.DB_CONNECT,
  port: process.env.DB_PORT,
  user: "root",
  password: process.env.DB_PASSWORD,
});


router.post('/register', async (req, resp) => {
  //validation
  const { error } = registerValidation(req.body);
  if (error)
    resp.status(400).send(error.details[0].message);

  //crypt password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  //request into base
  await con.connect(function (err, result) {});
  const sql = `INSERT INTO sys.Users (_id, name, email, password, date) VALUES ('${user._id}', '${user.name}', '${user.email}', '${user.password}', '${user.date}')`;
  await con.query(sql, function (err, result) {
    //
    if (err)
      resp.status(400).send(err.sqlMessage);
    else
      resp.status(201).send('User created');
  })

});

router.post('/login', async (req, resp) => {
  //validation
  const { error } = loginValidation(req.body);
  if (error)
    resp.status(400).send(error.details[0].message);

  //request into base
  const sql = `SELECT _id, password FROM sys.Users WHERE email = '${req.body.email}'`;
  await con.query(sql, async function (err, result) {

    if (err)
      resp.status(400).send(err.sqlMessage);

    if (!result.length) {
      resp.status(400).send('user for this email not found')
    }

    //check password on valid
    const isValidPassword = await bcryptjs.compare(req.body.password, result[0].password);
    if (isValidPassword) {
      const token = jwt.sign({ _id: result[0]._id }, process.env.TOKEN_SECRET);
      resp.header('auth-token', token).send(token);
    } else {
      resp.status(400).send('Invalid password')
    }
  });


});

module.exports = router;