const express=require('express')
const router=express.Router()
const userController = require('../controllers/userController')
const userValidation = require('../validation');
const auth = require('../auth');
const admin = require('../isAdmin');
require('dotenv').config()

router.post("/register",userValidation.userRegister,userController.register);
router.post("/login",userValidation.userLogin,userController.login);
router.post("/changePassword",auth,userValidation.changePassword,userController.changePassword);
router.post("/logout",auth,userController.logout);
router.get("/getProfile",auth,userController.getProfile);
router.post("/updateProfile",auth,userController.updateProfile);
router.post("/verifyOtp",auth,userController.verifyOtp);
router.get("/sendOtp",auth,userController.sendOtp);

router.post("/addPost",userValidation.userPost,auth,admin,userController.addPost);
router.get("/getPost",auth,userController.getPost);

router.post("/uploadImage",auth,userController.uploadImage);
router.post("/uploadDocument",auth,userController.uploadDocument);
router.post("/uploadVideo",auth,userController.uploadVideo);

module.exports=router;