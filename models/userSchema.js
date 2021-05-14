const mongoose = require('mongoose');
const UserShares = require('./UserShares');
const UserVideos = require('./videosModel');
const userSchema = new mongoose.Schema({
  phonenumber:{type:Number,default:1234567890},
  acountballance: { type: Number,default:5}, 
  username:String,
  firstname: String,
  lastname: String, 
  email:  String ,
  password: String,
  pkey: String,
  stuckTracker:Array,
  is_active: { type: Boolean, default: 0 },
  googleId: { type: String, default:"googleid" },
  api_token:{type:String,default:"api_token"}, 
  liverate:{type:Boolean,default:0},
  Shares:[UserShares.schema],
CardCredentials:{type:Object,default:{cardName:'Dogubo Mamuzo Joshua',cardNumber:'4583893489479678329',cardType:'visacard'}},//will be encrypted in production 
videos:[
  UserVideos.schema
],
profile_pic:{type:String,default:'/avatar.png'},
videoCollections:{type:Array, default:{url:"abc",poster:"abc"}}//conatin a video of how to use the api
})
module.exports = mongoose.model('userSchema', userSchema);