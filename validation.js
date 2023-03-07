const response = require('./controllers/response');
const Validator = require('validatorjs');

function userRegister(req, res, next) {

  const validationRule = {
      "name": "required|string",
      "email": "required|email",
      "password": "required|min:6|max:15",
  }
  validatorUtilWithCallback(validationRule, {}, req, res, next);
}

function userLogin(req, res, next) {

  const validationRule = {
      "email": "required|email",
      "password": "required",
  }
  validatorUtilWithCallback(validationRule, {}, req, res, next);
}

function validatorUtilWithCallback (rules, customMessages, req, res, next) {
  const validation = new Validator(req.body, rules, customMessages);
  validation.passes(() => next());
  if(validation.fails()){
    return res.status(400).send(response.validationError(formattedErrors(validation.errors.errors)));
  }
};

function formattedErrors(err) {
  let transformed = {};
  Object.keys(err).forEach(function (key, val) {
      transformed[key] = err[key][0].replace(/[_]/g, " ");
  })
  return transformed
}

module.exports = { 
  formattedErrors,
  validatorUtilWithCallback,
  userRegister,
  userLogin 
}