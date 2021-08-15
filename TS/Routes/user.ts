import mongoose from "mongoose";
import express from "express";
import { User } from "../Models/user";
import bcrypt from "bcrypt";
import { isLoggedIn } from "../MiddleWare/logedInAuth";
import { isAdmin } from "../MiddleWare/isAdminAuth";
import { Cart } from "../Models/cart";

const router = express.Router();

//create a new user

router.post('/',async (req, res) => {
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

    if(req.body.userName.length < 4 )
        inputLength+=Length.ShortUserName;
    if(req.body.password.length < 6)
        inputLength+=Length.ShortPassword;
    if(req.body.userName.length > 15 )
        inputLength+=Length.LongUserName;
    if(req.body.password.length > 30)
        inputLength+=Length.LongPassword;

    //Checking inpute length
    switch (inputLength){
        case Length.ShortUserNameandPassword:
            res.send(`User name and password are too short. 4 < userName < 15 , 6 < password < 30`).status(409)
        return;
        case Length.ShortUserName:
            res.send(`User name is too short. 4 < userName < 15 `).status(409)
        return;
        case Length.ShortPassword:
            res.send(`Password is too short. 6 < password < 30`).status(409)
        return;
        case Length.LongUserNameandPassword:
            res.send(`User name and password are too Long. 4 < userName < 15 , 6 < password < 30`).status(409)
        return;
        case Length.LongUserName:
            res.send(`User name is too long. 4 < userName < 15`).status(409)
        return;
        case Length.LongPassword:
            res.send(`Password is too long. 6 < password < 30`).status(409)
        return;
        case Length.ShortPasswordandLongUserName:
            res.send(`User name is long password is short. 4 < userName < 15 , 6 < password < 30`).status(409)
        return;
        case Length.ShortUserNameandLongPasswords:
            res.send(`User name is short and password is long. 4 < userName < 15 , 6 < password < 30`).status(409)
        return;
    }

    if( await User.findOne({userName: req.body.userName}))
    {
        return res.send("UserName is taken, please choose another");
    }

    const user = new User();
    user.userName= req.body.userName;
    user.password= await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
    user.isPremium = false;
    user.isAdmin = false;

    //creating a new cart
    const userCart =  new Cart();
    user.cartID=userCart._id;
    
    await userCart.save();
    await user.save();
    // console.log(user);
    res.send('User created');
    
    
});

router.put("/setAsAdmin/:_id",isLoggedIn, isAdmin,async (req,res)=>{
    let user = await User.findOne({_id: req.params._id});
    if(!user)
        return res.status(404).send("No user found with this ID");
    
    if(user.isAdmin)
        return res.status(409).send("User is already Admin")
    else
    {
        user.isAdmin=true;
        await user.save();
        return res.status(200).send("User is now Admin")
    }

});


router.put("/removeAdmin/:_id",isLoggedIn, isAdmin,async (req,res)=>{
    let user = await User.findOne({_id: req.params._id});
    if(!user)
        return res.status(404).send("No user found with this ID");
    
    if(user.isAdmin)
    {
        user.isAdmin=false;
        await user.save();
        return res.status(200).send("User is now Demoted")
    }
    else
    {
        return res.status(409).send("User is not an admin anyway")
    }

});

router.put("/subscribe",isLoggedIn,async (req,res)=>{
    let user = await User.findOne({_id: req.user._id});
    if(user!.isPremium)
    {
        // console.log(user)
        return res.status(409).send("User is already premium")
    }
    else
    {
        user!.isPremium=true;
        await user!.save();
        return res.status(200).send("User is now Premium")
    }
});

router.put("/unsubscribe",isLoggedIn,async (req,res)=>{
    let user = await User.findOne({_id: req.user._id});  
    // console.log(user);
    if(user!.isPremium)
    {

        user!.isPremium=false;
        await user!.save();
        return res.status(409).send("User now unsubscribed")
    }
    else
    {
        return res.status(200).send("User is not a premium to unsubscribe")
    }
});
export default router;