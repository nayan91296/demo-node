const express=require('express')
const router=express.Router()
const userController = require('../controllers/userController')
const userValidation = require('../validation');

router.get("/register",userValidation.userRegister,userController.register);
router.get("/login",userValidation.userLogin,userController.login);

module.exports=router;