require('dotenv').config() ; 
const app = require('./src/app');
const port = process.env.PORT ; 
 const connectedDb = require('./src/config/db'); 

 connectedDb(); 
 
app.listen(port , ()=>{
    console.log(`Server is Running at the port - ${port}`); 
})