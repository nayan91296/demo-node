const userModel = require('../models/user.js');
const response = require('../controllers/response');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let Validator = require('validatorjs');

const register = (async (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10, async(err, hashedPassword) => {
        if (err) {
          return res.status(401).send(response.error(err));
        }

        await userModel.create({
            name : name,
            email : email,
            password : hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1h' });
        return res.status(200).send(response.success(token));
    });
})

const login = (async(req, res) => {

    const { email, password } = req.body;
    var userD = await userModel.findOne({where:{email:email}});
    if(userD == null){
      return res.status(401).send(response.error('User not exist'));
    }
    bcrypt.compare(password, userD.password, (err, result) => {
      if (err) {
        return res.status(401).send(response.error('Authentication failed'));
      }
      if (!result) {
        return res.status(401).send(response.error('Authentication failed'));
      }
      const token = jwt.sign({ email }, 'secret', { expiresIn: '1h' });
      return res.status(200).send(response.success(token));
    });

  });

module.exports = { login, register }