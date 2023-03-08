const userModel = require('../models/user.js');
const response = require('../controllers/response');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let Validator = require('validatorjs');
const multer = require('multer');
const bodyParser = require("body-parser");
const path = require('path');
const fs = require('fs');

const register = (async (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10, async(err, hashedPassword) => {
        if (err) {
          return res.status(401).send(response.error(err));
        }
        var userRegister = await userModel.create({
            name : name,
            email : email,
            password : hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        var userId = userRegister.toJSON().id;
        const token = jwt.sign({ userId }, 'secret', { expiresIn: '1h' });
        return response.success(req, res, token);
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
      return response.success(req, res, token);
      
    });

  });

const getProfile = (async(req, res) => {
    var userD = await userModel.findOne({raw: true,where:{id:req.userId}});
    if(userD == null){
      return res.status(401).send(response.error('User not exist'));
    }
    return response.success(req, res, userD);
  });

const uploadImage = (async(req, res) => {
  
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        // console.log('req.file',file);
        let serverImagePath = './public/uploads/';
              
        if (!fs.existsSync(serverImagePath)) {
            fs.mkdirSync(serverImagePath, { recursive: true });
        }
        cb(null, serverImagePath)
      },
      filename: function (req, file, cb) {
        // console.log('req.file f',file);
        cb(null, Date.now()  + '-' + file.originalname)
      }
    })
    var uploaFiles = multer({ storage: storage }).single('avatar');
    // console.log('u',uploaFiles);
    uploaFiles(req, res, async (err) => {
      console.log('req.file',req.file);
      if (!req.file) {
          resUnauthorized = {
              'message': "Please select an image !!",
          }
          return res.status(401).send(response.error(resUnauthorized));
      } else if (err) {
        console.log(err);
          resUnauthorized = {
              'message': err,
          }
          // logger.info("Image Upload Validation");
          // logger.info(err);
          return res.status(401).send(response.error(resUnauthorized));
          // return sendError(req, res, resUnauthorized);
      } else {
          try {
              var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.svg)$/i;
              if (!allowedExtensions.exec(req.file.filename)) {
                  resUnauthorized = {
                      'message': "Please select only image !",
                  }
                  return res.status(401).send(response.error(resUnauthorized));
                  // return sendError(req, res, resUnauthorized);
              }
              avatar = process.env.APP_IMAGE_BASE_URL + 'uploads/' + req.file.filename;
              const responseData = {
                  'message': "Image Updated Successfully",
                  'data': {
                      img: avatar,
                      filename: req.file.filename
                  }
              };
              return response.success(req, res, responseData);
              // return sendSuccess(req, res, responseData);
          } catch (err) {
              // resUnauthorized = {
              //     'message': process.env.APP_ERROR_MESSAGE,
              // }
              // logger.info("Image Upload ");
              // logger.info(err);
              // return sendError(req, res, resUnauthorized);
          }
      }
  });
})

module.exports = { login, register, getProfile, uploadImage }