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
        
        const salt =await bcrypt.genSalt(process.env.SaltNumber);
        const hashPassword =await bcrypt.hash(this.password , salt); 
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