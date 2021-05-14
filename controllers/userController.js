const { login, register, logout } = require('./authenticateController');
const bodyParser = require('body-parser').urlencoded({ extended: false });
const { Mongoose } = require('mongoose');
const passport = require('passport');
const { isAuth } = require('../lib/authmiddleware');
const connection = require('../config/dbconnection');//getting to connect to perform action
const { json } = require('body-parser');
mongoose = require('mongoose');
const mongodb = require('mongodb');
const crypto = require('crypto');
const { email_check } = require('../lib/emailExit');
const Messages = require('../config/activityStatus/MessageGen');
const User = connection.models.User//all seaches access user db model and find matches



module.exports = function userController(app) {
    app.get('/register', (req, res) => {
        res.send('registeration endpoint for form');

    }).post("/register", bodyParser, email_check, register, (req, res) => {
        //res.send('register_endpoint_success')//redirect('/')
    }).post('/login', bodyParser, passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/' }), (req, res, next) => {
        //res.send('login endpoint')

    });

    app.get('/', bodyParser, (req, res) => {
        let instruction = `**this app is basic backend stuckTrade tracker developed by me dogubo mamuzo joshua
        **pls run npm install to run app locally
        **to use db either install mongodb locally or use mongodb atlass 
        **first make a get request to /login
        **make a post request to /register with your email and password in json format
        **you will get auth token, use token to login with your email and password 
        
        ** use get  /profile to get your profile
        **use post /buyshares to add shares to user account note this is provided from abroker in front end but you can provide shares detaial **which includes symbol,company name, volume, rate, etc
        **use   get /shares to get all your shares
        **use /sellshares/shareid eg 32hex value from your available shares
        **all routh is protected from unauthorised asses to data
        ** check for price update for a particular share us /qoute/symbol   not symbol is 3 string value ie IBM
        
        *******pls note you must register and login before you acces any of the routh except registeration routh thanks`

        res.status(200).json(new Messages(200,`${instruction}`));
    });



    app.get("/profile", isAuth, (req, res, done) => {
        //  console.log(req.user); 
        req.user ? res.status(200).json(req.user) : res.status(401).json(new Messages(401, 'not authorizes'));
    });


    app.get('/logout', logout, (req, res) => {
        res.redirect('/');
    }).get("*", (req, res) => {
        return res.status(400).json(new Messages(400, 'not found'))
    });


}