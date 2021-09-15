const express = require('express');

const User = require('../Models/userModel');
var bcrypt = require('bcryptjs') 
var salt = bcrypt.genSaltSync(10);
const nodemailer = require("nodemailer");
const router = express.Router();
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
router.get('/check-user/:id',async function(req,res){
   try{
   
    if(req.params.id)
    {
       let users= await User.findOne({"email":req.params.id})
       
       if(users)
       {
        let id=uuidv4()
        let url=process.env.BASE_URL+'/'+users.id
        var transporter = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "0987bcd10d5bf2",
            pass: "c1edae4a3d21d6"
          }
        });
          let info = await transporter.sendMail({
            from: 'password-recovery@gmail.com', // sender address
            to: users.email, // list of receivers
            subject: "Password Recovery Mail", // Subject line
            text: url,
          });
          console.log("Message sent: %s", info.messageId);
          users.password=null
          users.isActive=true
          users.save()
          res.json({status:true,message:users.email})

          setTimeout(()=>{
            users.isActive=false
            users.save()
          },600000)
       }
       else{
           res.json({status:false,message:"User Not found"})
       }
    }
    else{
        res.send("Invalid Request")
    }
   } 
   catch(e)
   {
    console.log(e)
    res.json({status:false,message:"Something went wrong"})

   }
})
router.get('/checkid/:id',async function(req,res){
    try{
      console.log(req.params)
       let user=await User.findOne({_id:req.params.id,isActive:true})
       console.log(user)
       if(user)
       {
            res.json({status:true,data:user,message:""})
       }
       else{
           res.json({status:false,message:"Invalid Link.Please try again"})
       }
    }catch(ex){
        console.log(ex)
        res.send("Something went wrong")
    }
})
router.post('/forget-password',async function(req,res){
  try{
    let data=req.body
    console.log(data)
    let users= await User.findOne({"_id":data.user_id})
    if(users)
    {
           users.isActive=false
           bcrypt.hash(req.body.password, salt, function(err, hash) {
            users.password=hash
            users.update_ts=Date.now()
            users.save()
          });
          
          
          res.json({status:true,message:"Forget Password updated Successfully"})
    }
    else{
        res.json({status:false,message:"Invalid Link.Please try again"})
    }
 
 }catch(ex){
  res.json({status:false,message:"Something went wrong"})
}
})
router.post('/register',async function(req,res){
  try{
    let {name,email,password}=req.body
    let users= await User.findOne({"user_email":email})
    console.log(users)
    console.log(req.body)
    if(users==null)
    {    
          user=new User()
          console.log(req.body.password)
         
          user.password=await bcrypt.hash(req.body.password,salt) 
          user.username=name
          user.email=email
          user.update_ts=Date.now()
          user.isActive=false
          console.log(user)
          user.save()
         
          res.json({status:true,message:"User Registered Successfully"})
    }
    else{
        res.json({status:false,message:"Already Registered"})
    }
 }catch(ex){
   console.log(ex)
   res.json({status:false,message:"Already Registered"})
    //  res.send("Something went wrong")
 }
})

router.post('/login',async (req,res) => {
  try{
      const {email,password}=req.body;
console.log(password)
      // if(!( email && password )) {
      //   res.send("Enter the inputs");
      // }
     const user = await User.findOne({email:email});
     console.log(user)
    if(user){
      if((await bcrypt.compare(password,user.password))) {
        /*const token = jwt.sign(
          {email: user.email},
          process.env.TOKEN_KEY,
           {
             expiresIn:"15min"
            }
        );
        user.token = token;*/
        res.status(200).json({status:true,data:user});
   }
   else{
    res.json({status:false,message:"You have entered an invalid username or password"})
   }
    }
    else{
      res.json({status:false,message:"You have entered an invalid username or password"})
    }
     
  }catch(err) {
      console.log(err)
      res.json({status:false,message:"Something went wrong Please try again later"})

  }   
});
module.exports = router;
