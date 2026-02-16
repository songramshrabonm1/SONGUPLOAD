const UserModel = require("../models/user.models");
const jwt = require('jsonwebtoken') ; 

const Register = async(req,res)=>{
    try{
        const { userName, email, password , role = 'user'} = req.body; ; 
        if (!userName || !email || !password) {
          return res.status(400).json({
            message: "All Fields Are required",
            success: false,
            statusCode: 400,
          });
        }
        const ExistUser = await UserModel.findOne(
          $or[({ email }, { userName })],
        ); 
        if(ExistUser){
            return res.status(400).json({
                success : false , 
                statusCode : 400 , 
                message : 'Email or UserName Already Registered'
            })
        }

        const UserCreate = await UserModel.create({
          userName,
          email , 
          password,
          role
        });
        const token = jwt.sign(
          { userId: UserCreate._id, role },
          process.env.JWT_SECRET_KEY,
          { expiresIn  : process.env.TokenExpireTime},
        );
        res.cookies('token' ,token );

        res.status(201).json({
            message : 'User Registered Successfully...' , 
            statusCode : 201 , 
            success : true ,
            token 
        })

    }catch(error){
        console.error(error.message); 
        return res.status(500).json({
            message : "Internal Server Error" , 
            statusCode : 500 , 
            success : false 
        })
    }
}


const Login = async(req,res)=>{
    try{

        const {email , password} = req.body; 
        if(!email || !password){
            return res.status(400).json({
                message :'All Fields Must Be Required' , 
                success : false , 
                statusCode : 400
            })
        }
        const userExist = await UserModel.findOne({email}); 
        if(!userExist){
            return res.status(400).json({
                message : 'Register First , User Not Exist' , 
                success : false , 
                statusCode : 400
            })
        }
        const isMatchPassword = await userExist.ComparePassword(password); 
        if(!isMatchPassword){
            return res.status(401).json({
                success : false , 
                statusCode : 401, 
                message : 'Wrong Password' 
            })
        }
        const token = jwt.sign(
          { userId: userExist._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: process.env.TokenExpireTime },
        ); 
        res.cookies('token', token);

        return res.status(200).json({
            success : true, 
            message : 'Login Successfully...' , 
            statusCode : 200, 
            data : userExist , 
            token
        })

    }catch(error){
        console.error(error.message) ; 
        return res.status(500).json({
            message : 'Internal Server Error' , 
            statusCode : 500, 
            success : false , 
        })
    }
}

module.exports = {Login, Register}; 