const userModel = require('../models/user');
const response = require('../controllers/response');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let Validator = require('validatorjs');
const multer = require('multer');
const bodyParser = require("body-parser");
const path = require('path');
const fs = require('fs');
var express = require('express')
var app = express()
const postModel = require('../models/post');

const register = (async (req, res) => {
    const { name, email, password } = req.body;
    const isEmailUnique = await checkUniqueEmail(userModel,email);
    if (!isEmailUnique) {
      return res.status(401).send(response.error('Email already exist'));
    }
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

const checkUniqueEmail = async (user,email) => {
  const existingUser = await user.findOne({ where:{email:email }});
  console.log('existingUser',existingUser);
  return !existingUser;
};

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
      var userId = userD.id;
      const token = jwt.sign({ userId }, 'secret', { expiresIn: '1h' });
      return response.success(req, res, token);
      
    });

  });

const getProfile = (async(req, res) => {
    var userD = await userModel.findOne({where:{id:req.userId}});
    if(userD == null){
      return res.status(401).send(response.error('User not exist'));
    }
    return response.success(req, res, userD);
  });

const uploadImage = (async(req, res) => {
  
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        let serverImagePath = './public/uploads/';
        if (!fs.existsSync(serverImagePath)) {
            fs.mkdirSync(serverImagePath, { recursive: true });
        }
        cb(null, serverImagePath)
      },
      filename: function (req, file, cb) {
        cb(null, Date.now()  + '-' + file.originalname)
      }
    })
    var uploaFiles = multer({ storage: storage }).single('avatar');
    
    uploaFiles(req, res, async (err) => {
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
      
          return res.status(401).send(response.error(resUnauthorized));
          
      } else {
          try {
              var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.svg)$/i;
              if (!allowedExtensions.exec(req.file.filename)) {
                  resUnauthorized = {
                      'message': "Please select only image !",
                  }
                  return res.status(401).send(response.error(resUnauthorized));
                  
              }
              avatar = process.env.APP_IMAGE_BASE_URL + req.file.filename;
              const responseData = {
                  'message': "Image Updated Successfully",
                  'data': {
                      img: avatar,
                      filename: req.file.filename
                  }
              };
              
              return response.success(req, res, responseData);
             
          } catch (err) {
            return res.status(401).send(response.error(err));
          }
      }
  });
})

const updateProfile = (async(req, res) => {
  await userModel.update(
    {
      name: req.body.name,
      profile : req.body.profile
    },
    {
      where: { id:req.userId },
    }
  );
  return response.success(req, res, 'Profile updated successfully..');
});

const addPost = (async(req, res) => {
    var post = await postModel.create({
        name : req.body.name,
        user_id : req.body.user_id,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return response.success(req, res, post);
});

const getPost = (async(req, res) => {
  var postData = await postModel.findAll({
    include: [{
      model: userModel
    }]
  });
  return response.success(req, res, postData);
});

module.exports = 
{ 
  login,
  register,
  getProfile,
  uploadImage,
  updateProfile,
  addPost,
  getPost
}