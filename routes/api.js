const router= require('express').Router();
const User = require('../model/User');


router.post('/register', async (req, resp) => {


  try {

  } catch (e) {
    resp.send(e).statusCode(400);
  }




});

module.exports = router;