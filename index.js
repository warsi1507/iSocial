const express = require('express')
const expressLayout = require('express-ejs-layouts')


const app = express();
const port = 8000;

// use static files 
app.use(expressLayout)

// extract styles and scripts from sub pages into the layouts
app.set('layout extractStyles', true)
app.set('layout extractScripts', true)

// use express router
app.use('/', require('./routes/index.js'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, (err)=>{
    if(err){
        console.error(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
})