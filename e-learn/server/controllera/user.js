import { json } from "express";
import User from "../models/user.js";

export const register = async (req, res) => {
  try {
   const {email,name,password} = req.body
   let user =await User.findOne({email});
   if(user){

    return res.status(400),json({
        message:"user exist",
    });

    const hashPassword  = await bcrypt.hash(password,10)
  user ={
     name,
     email,
     password:hashPassword
  }

  const otp = Math.floor(Math.random()*1000000);
  const

   }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
