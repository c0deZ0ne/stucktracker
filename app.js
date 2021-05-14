var express = require('express');
var app = express();
const session = require('express-session')
const mongoSore = require("connect-mongo")(session);
const { connection } = require('./config/conection');
const passport  = require('passport');
require('dotenv').config()
connection(app)
//:::::::::::require rouths:::::::::::::: 

//::::::::::require controloers::::::::::::::

var sharesController = require('./controllers/sharesController');// access files and functions in todocontrolers
var userController = require('./controllers/userController');
const bodyParser = require('body-parser');
//:::::::::::setup routes::::::::::::::

app.use(express.json());
 app.use((req,res,next)=>{
    next();
});

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());


// calling todocontroller with full (express)app
sharesController(app);
userController(app);
app.listen(process.env.PORT)
console.log("listening to port",process.env.PORT);
