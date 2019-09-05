// validation
const joi = require('@hapi/joi');

//register validation
const registerValidation = (data) => {
  const schema = {
    name: joi.string().min(6).required(),
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
  };
  return joi.validate(data, schema);
};

//fb register validation
const fbRegisterValidation = (data) => {
  const schema = {
    name: joi.string().min(6).required(),
    email: joi.string().min(6).required().email(),
  };
  return joi.validate(data, schema);
};

//login validation
const loginValidation = (data) => {
  const schema = {
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
  };
  return joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.fbRegisterValidation = fbRegisterValidation;
module.exports.loginValidation = loginValidation;