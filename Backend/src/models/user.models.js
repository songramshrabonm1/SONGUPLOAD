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
        match : [/^\S+@\S+\.\S+$/,'Please Provide A valid Email'],
        required : [true , "Email Must be Required"]
    }, 
    password : {
        type : String , 
        required : true, 
        minlength : [6, "Password Must Be greater than 6 character"],
        select : false 
    }, 
    role : {
        type : String , 
        enum : ['User' , 'Artist'], 
        default : 'User'
    }, 
    otp : {
        type : String , 
        default : '' 
    }, 
    isOtpExpired : {
        type : Boolean , 
        default : null  
    }, 
    OtpTime : {
        type : Date , 
        default :()=>  Date.now() + 5 * 60 * 1000
    }
}, {timestamps : true}) ; 

userSchema.pre('save' , async function(next){
    try{
        
        if(!this.isModified('password')){
            return next();
        }
        const salt =await bcrypt.genSalt(Number(process.env.SaltNumber));
        const hashPassword =await bcrypt.hash(this.password , salt); 
        this.password = hashPassword;
        next() ; 
    }catch(error){
        console.error(error.message);
    }
})

userSchema.methods.ComparePassword = async function(enterPassword){
    return await bcrypt.compare( enterPassword , this.password); 
}

const UserModel = mongoose.model('users' ,userSchema) ; 
module.exports  = UserModel; 