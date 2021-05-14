const { genPassword,validatePassword }= require('../lib/passwordUtil');
const UserShares =require('../models/UserShares')
const userSchema = require('../models/userSchema')
const db = require('../config/dbconnection');
const { json } = require('body-parser');
const Messages  = require('../config/activityStatus/MessageGen');
const { JSONParser } = require('formidable');


 module.exports = {
//register handler;

logout : async function logout (req,res,done){
console.log("loging out....");
req.logout()
done(null);
},

register: async function register ( req,res,done){
    const { password,email } = req.body;
    ((password == null || undefined)||(email==null||undefined) )?res.send('password is required'):


        await genPassword(password).then((result)=>{
         let { salt, hash } = result
        // console.log(salt,hash);
          salt.toString;
          hash.toString;
          const {firstname,username,lastname,email,Shares,CardCredentials} = req.body 
         let data = {

            is_active: false,
            firstname:firstname,
            username:lastname, 
            lastname:username,
            email:email,
            password:hash,
            pkey:salt,
            googleId: "notSet",
            api_token:"notset", 
            liverate:{type:Boolean,default:0},
            Shares:[UserShares.schema],
            CardCredentials:CardCredentials,
            };

            let userdata=  JSON.parse(JSON.stringify(data))
        
           const users = new userSchema(userdata);  
         
          db.collection('users').findOne({email:userdata.email}).then((result)=>{
            if (!result){
              try {
                  
                db.collection('users').insertOne(users).then((users)=>{
                    users?res.status(201).json(new Messages(201,'user created successfully')):res.status(500).json(new Messages(500,'error creating during registeration'))
                    req.session.users=users;
                     done(null,users);
                    });
              } catch (error) {
                  //console.log(error)
                  done(null,users)
              }  
             
            }else{
                //res.redirect('/register')
                done(null,userrs);
            }
        }).catch(
            done(null) 
        )    
    })

}
}