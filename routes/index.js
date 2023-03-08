const express=require('express')
const router=express.Router()
const userController = require('../controllers/userController')
const userValidation = require('../validation');
const auth = require('../auth');
require('dotenv').config()

router.post("/register",userValidation.userRegister,userController.register);
router.post("/login",userValidation.userLogin,userController.login);
router.post("/uploadImage",userController.uploadImage);
router.get("/getProfile",auth,userController.getProfile);

module.exports=router;