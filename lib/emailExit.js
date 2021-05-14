
const Messages = require('../config/activityStatus/MessageGen');
const db = require('../config/dbconnection');

module.exports.email_check = (req,res,next)=>{
    const {email} = req.body;
    db.collection('users').findOne({email:email}).then((result)=>{

       if (result){
           return res.status(226).json(new Messages(226,"email alreadyExist"));
       }else{
           next(null);
       }
    })
}
