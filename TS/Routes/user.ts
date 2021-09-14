import mongoose from "mongoose";
import express from "express";
import { User } from "../Models/user";
import bcrypt from "bcrypt";
import { isLoggedIn } from "../MiddleWare/logedInAuth";
import { isAdmin } from "../MiddleWare/isAdminAuth";
import { Cart } from "../Models/cart";
import { Controller, Path, Post, Put, Query, Route, Security, Body, BodyProp } from "@tsoa/runtime";
import { Iuser } from "../Interfaces/Iuser";

const router = express.Router();

//create a new user
@Route("user")
export class userRoute extends Controller
{
    // router.post('/',async (req, res) => {
@Post()
public async createAccount(@BodyProp() userName:string, @BodyProp() password:string){


    //input validation
    let inputLength:number=0;
    enum Length{
        ShortUserName= 1,
        ShortPassword=2 ,
        ShortUserNameandPassword=3,
        LongUserName=10,
        LongPassword=20,
        LongUserNameandPassword=30,
        ShortUserNameandLongPasswords=21,
        ShortPasswordandLongUserName=12,
    }

    if(userName.length < 4 )
        inputLength+=Length.ShortUserName;
    if(password.length < 6)
        inputLength+=Length.ShortPassword;
    if(userName.length > 15 )
        inputLength+=Length.LongUserName;
    if(password.length > 30)
        inputLength+=Length.LongPassword;

    //Checking inpute length
    switch (inputLength){
        case Length.ShortUserNameandPassword:
            return(`User name and password are too short. 4 < userName < 15 , 6 < password < 30`)
        
        case Length.ShortUserName:
            return(`User name is too short. 4 < userName < 15 `)
        
        case Length.ShortPassword:
            return(`Password is too short. 6 < password < 30`)

        case Length.LongUserNameandPassword:
            return(`User name and password are too Long. 4 < userName < 15 , 6 < password < 30`)
        
        case Length.LongUserName:
            return(`User name is too long. 4 < userName < 15`)

        case Length.LongPassword:
            return(`Password is too long. 6 < password < 30`)
        
        case Length.ShortPasswordandLongUserName:
            return(`User name is long password is short. 4 < userName < 15 , 6 < password < 30`)
        
        case Length.ShortUserNameandLongPasswords:
            return(`User name is short and password is long. 4 < userName < 15 , 6 < password < 30`)
        
    }

    if( await User.findOne({userName: userName}))
    {
        throw new Error("UserName is taken, please choose another");
    }

    const user = new User();
    user.userName= userName;
    user.password= await bcrypt.hash(password, await bcrypt.genSalt(10));
    user.isPremium = false;
    user.isAdmin = false;

    //creating a new cart
    const userCart =  new Cart();
    user.cartID=userCart._id;
    
    await userCart.save();
    await user.save();
    // console.log(user);
    
    await User.createIndexes({userName: 1})
    return("User created")
}


@Security("isLoggedIn")
@Put("/setAsAdmin/{_id}")
public async setAsAdmin(@Path() _id: string){
// router.put("/setAsAdmin/:_id",isLoggedIn, isAdmin,async (req,res)=>{
    let user = await User.findOne({_id: _id});
    if(!user)
        return ("No user found with this ID");
    
    if(user.isAdmin)
        return ("User is already Admin")
    else
    {
        user.isAdmin=true;
        await user.save();
        return ("User is now Admin")
    }

}
@Security("isLoggedIn")
@Put("/removeAdmin/{_id}")
public async removeAdmin(@Path() _id:string){
// router.put("/removeAdmin/:_id",isLoggedIn, isAdmin,async (req,res)=>{
    let user = await User.findOne({_id: _id});
    if(!user)
        return ("No user found with this ID");
    
    if(user.isAdmin)
    {
        user.isAdmin=false;
        await user.save();
        return ("User is now Demoted")
    }
    else
    {
        return ("User is not an admin anyway")
    }

}
// router.put("/subscribe",isLoggedIn,async (req,res)=>{
@Security("isLoggedIn")
@Put("/subscribe/{_id}")
public async subscribe(@Path() _id:string){
    let user = await User.findOne({_id: _id});
    if(user!.isPremium)
    {
        // console.log(user)
        return ("User is already premium")
    }
    else
    {
        user!.isPremium=true;
        await user!.save();
        return ("User is now Premium")
    }
}


// router.put("/unsubscribe",isLoggedIn,async (req,res)=>{
@Security("isLoggedIn")
@Put("/unsubscribe/{_id}")
public async unsubscribe(@Path() _id:string){
    let user = await User.findOne({_id: _id});  
    // console.log(user);
    if(user!.isPremium)
    {

        user!.isPremium=false;
        await user!.save();
        return ("User now unsubscribed")
    }
    else
    {
        return ("User is not a premium to unsubscribe")
    }
}
}