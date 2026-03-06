import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req,res){

 try{

  const {name,email,password} = req.body;

  const exists = await User.findOne({email});

  if(exists){
   return res.status(400).json({
    error:"User already exists"
   });
  }

  const hashed = await bcrypt.hash(password,10);

  const user = await User.create({
   name,
   email,
   password:hashed
  });

  const token = jwt.sign(
   {id:user._id},
   process.env.JWT_SECRET,
   {expiresIn:"7d"}
  );

  res.json({
   token,
   user:{
    _id:user._id,
    name:user.name,
    email:user.email
   }
  });

 }catch(err){

  res.status(500).json({error:err.message});

 }

}

export async function login(req,res){

 try{

  const {email,password} = req.body;

  const user = await User.findOne({email});

  if(!user){
   return res.status(400).json({
    error:"Invalid credentials"
   });
  }

  const valid = await bcrypt.compare(password,user.password);

  if(!valid){
   return res.status(400).json({
    error:"Invalid credentials"
   });
  }

  const token = jwt.sign(
   {id:user._id},
   process.env.JWT_SECRET,
   {expiresIn:"7d"}
  );

  res.json({
   token,
   user:{
    _id:user._id,
    name:user.name,
    email:user.email
   }
  });

 }catch(err){

  res.status(500).json({error:err.message});

 }

}

export async function ssoLogin(req,res){

 try{

  console.log("🔹 SSO request received");

  const authHeader = req.headers.authorization;

  if(!authHeader){
   return res.status(401).json({error:"Token missing"});
  }

  const lmsToken = authHeader.split(" ")[1];

  console.log("🔹 LMS token:",lmsToken);

  // ⚡ TEMPORARY: decode instead of verify
  const decoded = jwt.decode(lmsToken);

  console.log("🔹 Decoded token:",decoded);

  const userId = decoded.userId || decoded.id;

  if(!userId){
   return res.status(401).json({error:"Invalid LMS token"});
  }

  let user = await User.findById(userId);

  if(!user){

   user = await User.create({
    name:"SSO User",
    email:`${userId}@sso.local`,
    password:"sso-user"
   });

  }

  const token = jwt.sign(
   {id:user._id},
   process.env.JWT_SECRET,
   {expiresIn:"7d"}
  );

  console.log("✅ AI Tutor token generated");

  res.json({token});

 }catch(err){

  console.log("❌ SSO ERROR:",err);

  res.status(401).json({
   error:"Invalid LMS token"
  });

 }

}