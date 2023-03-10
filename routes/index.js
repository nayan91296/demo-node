const express=require('express')
const router=express.Router()
const userController = require('../controllers/userController')
const userValidation = require('../validation');
const auth = require('../auth');
const admin = require('../isAdmin');
require('dotenv').config()

router.post("/register",userValidation.userRegister,userController.register);
router.post("/login",userValidation.userLogin,userController.login);
router.post("/uploadImage",auth,userController.uploadImage);
router.get("/getProfile",auth,userController.getProfile);
router.post("/updateProfile",auth,userController.updateProfile);
router.post("/addPost",userValidation.userPost,auth,admin,userController.addPost);
router.get("/getPost",auth,userController.getPost);
router.post("/logout",auth,userController.logout);

module.exports=router;