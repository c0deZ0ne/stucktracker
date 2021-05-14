const mongoose = require('mongoose')

const UserShares = new mongoose.Schema({
    CompanyNmae:{type:String,default:'IBM'},
    symbole:{type:String,default:'IBM'},
    dateBought: {type:Date,default:Date},
    Amount_available: {type:Number,default:1},
    Rate:{type:Number,default:1.0},
    Status: { type: String, default: "availble"},
    volume_bought:{type:Number, default:1},
    Price_update:Array

})

module.exports = mongoose.model('UserShares', UserShares)