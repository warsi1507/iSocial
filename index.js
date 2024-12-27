const express = require('express')


const app = express();
const port = 8000;

app.use('/', require('./routes/index.js'));

app.listen(port, (err)=>{
    if(err){
        console.error(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
})