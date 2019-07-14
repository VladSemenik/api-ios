const express = require('express');
const apiRoute = require('./api');
const authRoute = require('./auth');

const router = express.Router();

router.use('/api', apiRoute);
router.use('/auth', authRoute);

module.exports = router;