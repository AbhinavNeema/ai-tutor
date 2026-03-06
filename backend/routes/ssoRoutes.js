import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { verifyLMSToken } from "../middleware/lmsAuth.js";

const router = express.Router();

router.post("/sso-login",verifyLMSToken,async(req,res)=>{

 try{

   const {id,email,name} = req.lmsUser;

   let user = await User.findOne({email});

   if(!user){

     user = await User.create({
       name,
       email,
       password:"sso_user"
     });

   }

   const token = jwt.sign(
     {id:user._id},
     process.env.JWT_SECRET,
     {expiresIn:"7d"}
   );

   res.json({
     token,
     user
   });

 }catch(err){

   res.status(500).json({error:err.message});

 }

});

export default router;