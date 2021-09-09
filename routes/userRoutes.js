const express = require("express")
const router = express.Router();
// user controller 
const {loadSignup, loadLogin, registerValidation, postRegister, postLogin, loginValidations} = require("../controller/usercontroller");
const { stopLogin } = require("../middleware/auth");

// LoadSignup route
router.get('/',stopLogin ,loadSignup)
// User Login Route
router.get('/login',stopLogin,loadLogin)
// User account created page section
router.post("/register",registerValidation,postRegister)
router.post("/postLogin",loginValidations,postLogin)

module.exports=router ;