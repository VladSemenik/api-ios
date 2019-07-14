const jwt = require('jsonwebtoken');

module.exports = function (req, resp, next) {
  const token = req.header('auth-token');
  if (!token)
    return resp.status(401).send('Access denied');

  try {
    req.user = jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch (e) {
    resp.status(400).send('Invalid Token');
  }
};