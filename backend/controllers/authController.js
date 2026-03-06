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

  console.log("🔹 Authorization header:", authHeader);

  if(!authHeader){
   console.log("❌ No Authorization header");
   return res.status(401).json({error:"Token missing"});
  }

  const lmsToken = authHeader.split(" ")[1];

  console.log("🔹 LMS token:", lmsToken);

  // decode without verifying
  const decodedUnsafe = jwt.decode(lmsToken);
  console.log("🔹 Decoded token (no verify):", decodedUnsafe);

  console.log("🔹 Using JWT_SECRET:", process.env.JWT_SECRET);

  // verify token
  const decoded = jwt.verify(lmsToken, process.env.JWT_SECRET);

  console.log("✅ Token verified:", decoded);

  const userId = decoded.id;

  console.log("🔹 UserId from token:", userId);

  if(!userId){
   console.log("❌ userId missing in token");
   return res.status(401).json({error:"Invalid LMS token"});
  }

  let user = await User.findById(userId);

  console.log("🔹 User from DB:", user);

  if(!user){

   console.log("⚠️ User not found, creating SSO user");

   user = await User.create({
    name:"SSO User",
    email:`${userId}@sso.local`,
    password:"sso-user"
   });

   console.log("✅ SSO user created:", user._id);

  }

  const token = jwt.sign(
   {id:user._id},
   process.env.JWT_SECRET,
   {expiresIn:"7d"}
  );

  console.log("✅ AI Tutor token generated:", token);

  res.json({token});

 }catch(err){

  console.log("❌ SSO ERROR:",err);

  res.status(401).json({
   error:"Invalid LMS token"
  });

 }

}