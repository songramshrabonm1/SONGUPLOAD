const express = require('express'); 
const { body } = require("express-validator");
const routers = express.Router() ; 

const {
  Register,
  Login,
  sendOtp,
  resendOtp,
} = require("../controllers/auth.controllers");

const RegisteredMiddlewareValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Provide Authentic Email'),
    body('userName')
        .trim()
        .isLength({min: 3})
        .withMessage("UserName must be 6 character present"),
    body('password')
        .isLength({min : 6})
        .withMessage('Password Must Be 6 character present')    
]

const LoginMiddlewareValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Provide Authentic Email') , 
    body('password')
        .isLength({min : 6})
        .withMessage('Password Must Be 6 character present')
]

const otpMiddlewareValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Provide Your Authentic Email'),

    body('otp')
        .isLength({min : 6 , max : 6})
        .withMessage('6 Digit Otp Must Be Provide')

]

routers.post("/Registration", RegisteredMiddlewareValidation, Register);
routers.post("/Login", LoginMiddlewareValidation, Login);
routers.post("/OTP", otpMiddlewareValidation,sendOtp);
routers.get("/resendOtp", resendOtp);

module.exports = routers;