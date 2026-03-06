import jwt from "jsonwebtoken";

export function verifyLMSToken(req,res,next){

  try{

    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
      return res.status(401).json({error:"Token missing"});
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    req.lmsUser = decoded;

    next();

  }catch(err){

    return res.status(401).json({error:"Invalid token"});

  }

}