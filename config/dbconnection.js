const mongoose = require('mongoose');
const UserShares = require('../models/UserShares');
require('dotenv').config()

 const dburl=process.env.DATABASE;

const dbOption= {
    useNewUrlParser:true,
    useUnifiedTopology:true
}

const connection = mongoose.createConnection(dburl,dbOption);
const userSchema = require('../models/userSchema')
const User = connection.model('User',userSchema.schema);

module.exports = connection;