import { RequestHandler } from "express";
import db from "../config/firebaseConfig";

export const creatUser:RequestHandler = async (req , res)=>{
    const {name, email} = req.body
    try {
        const usersRef = db.ref("users").push()
        const userData = {name,email}
        await usersRef.set(userData)
        res.status(201).json({message: "User created successfully",userID:usersRef.key,users:userData })
    } catch (error) {
        res.status(500).json({message: "Internal server error", error})
    }
}