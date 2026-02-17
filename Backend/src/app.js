const express = require('express') ; //require express 
const app = express() ; // express instance create 
const cors = require('cors'); 
const cookieparser =require('cookie-parser'); 


//Routers Import 
const authRouters = require('./routes/auth.routes');


app.use(express.json()); 
app.use(cookieparser());
app.use(express.urlencoded({extended : true})); 
app.use(cors({
    origin : true , 
    credentials : true , 
})); 





app.use('/api/auth', authRouters); 





module.exports = app ; 