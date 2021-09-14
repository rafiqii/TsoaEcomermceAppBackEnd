import mongoose, { Schema } from "mongoose";
import { Iuser } from "../Interfaces/Iuser"
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

const env = dotenv.config({path: path.normalize(path.resolve(__dirname, "../environment/.env"))})
const signature:Secret=process.env.jwtSignature as Secret;
const userSchema = new mongoose.Schema<Iuser>({
    userName: {type:String, index:true},
    password: String,
    isAdmin:  Boolean,
    isPremium: {type:Boolean, index:true},
    previousOrders: [{type: mongoose.Schema.Types.ObjectId, ref: "Order"}],
    cartID: [{type: mongoose.Schema.Types.ObjectId, ref: "Cart"}] // if it doesnt work change to string
});

userSchema.methods.generateToken=function(){
    const token = jwt.sign({_id:this._id, isAdmin:this.isAdmin, isPremium:this.isPremium, cartID:this.cartID}, signature)
    return token;
}


export const User= mongoose.model<Iuser>('User',userSchema);