const router= require('express').Router();
const mysql = require('mysql');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const verifyToken = require('../middleware/verifyToken');
const verifyFBToken = require('../middleware/verifyFBToken');

//models
const User = require('../model/User');
const FBUser = require('../model/FBUser');
//validation
const { registerValidation, fbRegisterValidation, loginValidation } = require('../validation');



router.post('/register', async (req, resp) => {

  const con = mysql.createConnection({
    host: process.env.DB_CONNECT,
    port: process.env.DB_PORT,
    user: "root",
    password: process.env.DB_PASSWORD,
  });

  //validation
  const { error } = registerValidation(req.body);
  if (error)
    return resp.status(400).send(error.details[0].message);

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

router.post('/fb_register', verifyFBToken, async (req, resp) => {

  const con = mysql.createConnection({
    host: process.env.DB_CONNECT,
    port: process.env.DB_PORT,
    user: "root",
    password: process.env.DB_PASSWORD,
  });

  //validation
  const { error } = fbRegisterValidation(req.body);
  if (error)
    return resp.status(400).send(error.details[0].message);

  const user = new FBUser({
    fb_id: req.body.fb_id,
    name: req.body.name,
    email: req.body.email,
  });

  //request into base
  await con.connect(function (err, result) {});
  const sqlCheckAlreadyCreated = `SELECT fb_id, email from sys.fbusers`;
  const sqlInsert = `INSERT INTO sys.FBUsers (_id, fb_id, name, email, date) VALUES ('${user._id}', '${user.fb_id}', '${user.name}', '${user.email}', '${user.date}')`;
  await con.query(sqlCheckAlreadyCreated, async function (err, result) {
    //
    if (err){
      console.log(err);
      resp.status(400).send(err.sqlMessage);
    }
    else{
      console.log(result);
      const isAlreadyCreated = result.find(e =>
        e.fb_id === req.body.fb_id || e.email === req.body.email
      );

      if (isAlreadyCreated){
        resp.status(200).send('fb user already created');
      } else {

        await con.query(sqlInsert, function (err, result) {
          //
          if (err){
            console.log(err);
            resp.status(400).send(err.sqlMessage);
          }
          else
            resp.status(201).send('fb user added');
        })

      }
    }
  });

});

router.post('/login', async (req, resp) => {

  const con = mysql.createConnection({
    host: process.env.DB_CONNECT,
    port: process.env.DB_PORT,
    user: "root",
    password: process.env.DB_PASSWORD,
  });

  //validation
  const { error } = loginValidation(req.body);
  if (error)
    return resp.status(400).send(error.details[0].message);

  //request into base
  const sql = `SELECT _id, password FROM sys.Users WHERE email = '${req.body.email}'`;
  await con.query(sql, async function (err, result) {

    if (err)
      return resp.status(400).send(err.sqlMessage);

    if (!result.length) {
      return resp.status(400).send('user for this email not found');
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

router.get('/photos/:name', verifyToken,  async (req, resp) => {

  const pathToPhotos = path.join(__dirname, `../data/${req.params.name}`);
  resp.set('Content-Type', 'text/html');
  resp.sendFile(pathToPhotos);

});

module.exports = router;