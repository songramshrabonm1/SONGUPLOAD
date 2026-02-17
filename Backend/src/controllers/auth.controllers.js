const UserModel = require("../models/user.models");
const jwt = require("jsonwebtoken");
const { sendOtpEmail } = require("../services/emails.services");
const {validationResult} = require('express-validator');

const Register = async (req, res , next) => {
  try {
    const validatinError = validationResult(req);
    if(!validatinError.isEmpty()){
      return res.status(400).json({
        statusCode : 400 , 
        error : validatinError.array()
      })
    }
    const { userName, email, password, role = "User" } = req.body;
    console.log('UserName: ' , userName);
    console.log('email: ' , email);
    console.log("Password: ", password);
    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "All Fields Are required",
        success: false,
        statusCode: 400,
      });
    }
    const ExistUser = await UserModel.findOne({
      $or: [{ email }, { userName }],
    });
    if (ExistUser) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Email or UserName Already Registered",
      });
    }

    const UserCreate = await UserModel.create({
      userName,
      email,
      password,
      role,
    });
    const token = jwt.sign(
      { userId: UserCreate._id, role: UserCreate.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.TokenExpireTime },
    );
    res.cookie("token", token, { httpOnly: true, secure: false });

    res.status(201).json({
      message: "User Registered Successfully...",
      statusCode: 201,
      success: true,
      token,
      data: {
        userName,
        email,
        role: UserCreate.role,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      statusCode: 500,
      success: false,
    });
  }
};

const Login = async(req, res) => {
  try {
       const validatinError = validationResult(req);
       if (!validatinError.isEmpty()) {
         return res.status(400).json({
           success: false,
           error: validatinError.array(),
         });
       }
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All Fields Must Be Required",
        success: false,
        statusCode: 400,
      });
    }
 
    const userExist = await UserModel.findOne({ email }).select("+password");
    if (!userExist) {
      return res.status(400).json({
        message: "Register First , User Not Exist",
        success: false,
        statusCode: 400,
      });
    }
    console.log('ismatchpassword');
    const isMatchPassword = await userExist.ComparePassword(password);
    if (!isMatchPassword) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Wrong Password",
      });
    }

    const token = jwt.sign(
      { userId: userExist._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.TokenExpireTime },
    );
    res.cookie("token", token);

    res.status(200).json({
      success: true,
      message: "Login Successfully... & send Otp for validation",
      statusCode: 200,
      data: {
        email : userExist.email , 
        

      },
      token,
    });

    const otp = Math.floor(100000+ Math.random()*999999)
    const OtpTostring = otp.toString() ; 

    userExist.otp = OtpTostring ; 
    userExist.isOtpExpired = false ; 
    userExist.OtpTime = Date.now() + 5 * 60 * 1000; 

    await userExist.save() ; 

    await sendOtpEmail(userExist.email, userExist.userName , OtpTostring); 



  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      statusCode: 500,
      success: false,
    });
  }
};


const sendOtp = async(req,res)=>{
    try{
        const {email , otp } = req.body ; 
        if(!email || !otp){
            return res.status(404).json({
                message : 'All Fields Required' , 
                success : false , 
                statusCode : 404
            })
        }
        const validationError = validationResult(req);
        if(!validationError.isEmpty()){
          return res.status(400).json({
            success : false , 
            statusCode : 400 , 
            error : validationError.array()
          })
        }
        const UserExist = await UserModel.findOne({email}) ; 
        if(!UserExist){
            return res.status(401).json({
                message : 'User Not Found' , 
                success : false , 
                statusCode : 401
            })
        }
        if(otp != UserExist.otp){
            return res.status(401).json({
                success : false , 
                message : "Incorrect Otp" , 
                statusCode : 401
            })
        }
        if(UserExist.OtpTime < Date.now()){
            UserExist.isOtpExpired = true ; 
            return res.status(401).json({
                message : "OTP EXPIRED , Resend Again" , 
                success : false , 
                statusCode : 401
            })
        }
        
        return res.status(200).json({
            message : 'OTP Successful' , 
            success : true , 
            statusCode : 200
        })
    }catch(error){
        console.error(error.message) ; 
        return res.status(500).json({
            message : 'Internal Server error', 
            statusCode : 500 , 
            success : false 
        })
    }
}

module.exports = { Login, Register, sendOtp };
