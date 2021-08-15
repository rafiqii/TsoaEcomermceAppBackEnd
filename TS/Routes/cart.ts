import mongoose from "mongoose";
import { Cart } from "../Models/cart";
import express from "express";
import { isLoggedIn } from "../MiddleWare/logedInAuth";
import { Product } from "../Models/product";
import { User } from "../Models/user";
import { Iproduct } from "../Interfaces/Iproduct";
import Tcart from "../Types/Tcart";

const router = express.Router();

router.get("/", isLoggedIn, async (req,res)=>{
    const myCart= await Cart.findById(req.user.cartID).populate({
        path: 'products',
        populate: 'productID'
   })
    let totalPrice=0;
    // console.log(totalPrice)
    // console.log(myCart);
    for(let i=0; i<myCart!.products.length; i++)
    {
        totalPrice+=myCart!.products[i].productID.price*myCart!.products[i].quantity;
        // console.log(totalPrice)
    }

    res.send(`${myCart}\nTotal price before discount is:${totalPrice}`);
});

router.put("/addItem/:_id", isLoggedIn, async (req, res)=>{

    const myProduct=await Product.findById(req.params._id);
    if(!myProduct)
        return res.status(404).send("product was not found");
    
    if(myProduct.isPremium && !(req.user.isPremium))
    {

        // console.log(req.user)
        return res.status(403).send("subscribe to access this product")
    }
    
    if(!req.body.quantity)
        return res.status(400).send("enter the quantity of your product");


    //Subtracting from product stock is done in order
    if(parseInt(req.body.quantity)>myProduct.stock)
        return res.status(409).send(`Not enough items in inventory. Avalible: ${myProduct.stock}, your order: ${req.body.quantity}`);
    
    const myCart = await Cart.findById(req.user.cartID);
    myCart!.products.push({productID: req.params._id as unknown as Iproduct, quantity: req.body.quantity});
    await myCart!.save();
    
    res.send("Item added");
    
})

router.put("/removeItem/:index", isLoggedIn, async (req,res) =>{
    const myCart = await Cart.findById(req.user.cartID);
    if(parseInt(req.params.index)<0 || parseInt(req.params.index)>myCart!.products.length-1)
        res.status(400).send("impropper index")
    
    myCart!.products.splice(parseInt(req.params.index),1);
    await myCart!.save();
    res.send("item removed")
    
})

export default router;