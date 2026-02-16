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