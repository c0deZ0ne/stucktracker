const Messages = require("../config/activityStatus/MessageGen")
module.exports.isAuth =(req,res,next)=>{
    if(req.isAuthenticated()){
        res.messages = new Messages(200, 'authorized')
        console.log(res.messages)
        next()

    }else{
        res.messages = new Messages(401, 'not authorized')
        console.log(res.messages)
        return res.redirect('/');
       
        
        
    }
}