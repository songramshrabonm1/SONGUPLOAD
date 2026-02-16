1. **First Commit**
    - First Create Backend & Frontend Folder 

<br>

## Backend Folder 
- node initialize করব প্রথম **npm init --y** 
- তারপর আমি package install করব **npm i express express-validator bcrypt multer cookie-parser mongoose jsonwebtoken cors dotenv @imagekit/nodejs**
- তারপর devdependency install করব. 
- package.json folder এ script এর মধ্যে "dev" : "nodemon server.js" আর "start" : "node server.js" 
- create src folder and inside this src folder create app.js file and then export this file 

```js
const express = require('express') ; //require express 
const app = express() ; // express instance create 
const cors = require('cors'); 
const cookieparser =require('cookie-parser'); 

app.use(express.json()); 
app.use(cookieparser());
app.use(express.urlencoded({extended : true})); 
app.use(cors({
    origin : true , 
    credentials : true , 
})); 

module.exports = app ; 
```

- now create .env file

- আমাদের server এর data গুলো তো একটা জায়গায় রাখতে হবে তার জন্য আমাদের DAtabase দরকার হবে আমরা এর জন্য আমাদের server mongodb connection করবো আমাদের server এ . এর জন্য আমরা config folder create করবো আর এর ভিতরে আমরা db.js file বানাবো আর mongodb এর সাথে connection এর code করব 

```js 
require('dotenv').config() ; 
const mongoose = require('mongoose'); 
const connectedDb = async()=>{
    try{

        await mongoose.connect(process.env.MONGOOSE_URI); 
    }catch(error){
        console.error(error.message); 
        process.exit(1) ; 
        // Database connected না হলে শুধু শুধু server চালানোর কোন দরকার নাই। যদি DATABASE না চলে 
        // তাহলে সরাসরি app বন্ধ হয়ে যাবে  
    }
}
```

- then create server.js file and start the server 

```js
require('dotenv').config() ; 
const app = require('./src/app');
const port = process.env.PORT ; 
 
app.listen(port , ()=>{
    console.log(`Server is Running at the port - ${port}`); 
})
```

- আমরা যে আমাদের Data save করবো mongodb তে এর জন্য আমাদের mongodb কে বলতে হবে আমাদের Data এর structure কীরকম হবে। মানে আমরা একটা model create করবো আমরা এই রকম ডাটা save করব mongodb তে। এখন আমরা বানাবো user model । এর জন্য আমরা models folder create করব তারপর user.models.js file create করব। 

```js
const mongoose =require('mongoose'); 
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    userName : {
        type : String , 
        required : [true , 'UserName Mustbe Needed'], 
        unique : [ true , 'Please Enter Unique UserName'] ,
        maxlength: [20, 'Charater must be lessthan 20 characters'] 
    }, 
    email : {
        type : String , 
        unique : [true , "This Email Already Present, submit Unique Email"] , 
        lowercase : true , 
        required : [true , "Email Must be Required"]
    }, 
    password : {
        type : String , 
        required : true, 
        minlength : [6, "Password Must Be greater than 6 character"]
    }, 
    role : {
        type : String , 
        enum : ['User' , 'Artist'], 
        default : 'Artist'
    }
}, {timestamps : true}) ; 

userSchema.pre('save' , async()=>{
    try{
        const salt = bcrypt.genSalt(process.env.SaltNumber);
        const hashPassword = bcrypt.hash(this.password , salt); 
        this.password = hashPassword
    }catch(error){
        console.error(error.message);
    }
})

userSchema.methods.ComparePassword = async(enterPassword)=>{
    return await bcrypt.compare(this.password, enterPassword); 
}

const UserModel = mongoose.model('User' ,userSchema) ; 
module.exports  = UserModel; 
```


- auth controllers create করব login আর registration করানোর জন্য controllers folder create করেছি তারপর authcontrollers.controllers.js file বানিয়েছি। 

```js
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
```
- এখন routes folder বানাবো আর login & registration route এ user গেলে কি হবে এর জন্য আমরা code করব 

```js
const express = require('express') ; 
const { Register, Login } = require('../controllers/auth.controllers');
const routers = express.Router() ; 

routers.post('/registration' , Register); 
routers.post('/login' , Login); 

module.exports = routers; 
```