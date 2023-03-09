const response = require('./controllers/response');
const Validator = require('validatorjs');
const userModel = require('./models/user')

function userRegister(req, res, next) {

  const validationRule = {
      "name": "required|string",
      "email": "required|email|exist:users,email",
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

function userPost(req, res, next) {
  const validationRule = {
      "name": "required",
      "user_id": "required",
  }
  validatorUtilWithCallback(validationRule, {}, req, res, next);
}

function validatorUtilWithCallback (rules, customMessages, req, res, next) {
  const validation = new Validator(req.body, rules, customMessages);
  validation.passes(() => next());
  validation.fails(() => res.status(400).send(response.validationError(formattedErrors(validation.errors.errors))));
  // if(validation.fails()){
  //   return res.status(400).send(response.validationError(formattedErrors(validation.errors.errors)));
  // }
};

Validator.registerAsync('exist', function (value, attribute, req, passes) {
  console.log('value',value,attribute);
  if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');

  let attArr = attribute.split(",");
  if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`);
  const { 0: table, 1: column } = attArr;

  let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`
  var find_filed = {};
  find_filed[column] = value;
  // valueExists function for username, email, mobile number async function
  userModel.findOne({ where: find_filed }).then((result) => {
      if (result) {
          passes(false, msg);
      } else {
          passes();
      }
  }).catch((err) => {
      passes(false, err);
  });
});

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
  userLogin,
  userPost 
}