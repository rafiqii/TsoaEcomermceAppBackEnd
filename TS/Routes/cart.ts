import mongoose from "mongoose";
import { Cart } from "../Models/cart";
import express from "express";
import { isLoggedIn } from "../MiddleWare/logedInAuth";
import { Product } from "../Models/product";
import { User } from "../Models/user";
import { Iproduct } from "../Interfaces/Iproduct";
import Tcart from "../Types/Tcart";
import { Controller, Get, Path, Request, Security, Put, Query, Route, Body, BodyProp} from "@tsoa/runtime";
import { Icart } from "../Interfaces/Icart";

@Route("/cart")
export class cartRouter extends Controller{
    @Security("isLoggedIn")
    @Get()
    public async getCart(@Request() req:Express.Request ):Promise<Icart>{
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
    
        // res.send(`${myCart}\nTotal price before discount is:${totalPrice}`);
        return myCart!
    }

// router.get("/", isLoggedIn, async (req,res)=>{

// });
@Security("isLoggedIn")
@Put("addItem/{_id}")
    public async addItemToCart(@Path() _id:string, @Request() req:Express.Request, @BodyProp() quantity:number):Promise<Icart>{
        const myProduct=await Product.findById(_id);
    if(!myProduct)
        throw new Error("product was not found");
    
    if(myProduct.isPremium && !(req.user.isPremium))
    {

        // console.log(req.user)
        throw new Error("subscribe to access this product")
    }
    
    if(quantity)
        throw new Error("enter the quantity of your product");


    //Subtracting from product stock is done in order
    if(quantity>myProduct.stock)
        throw new Error(`Not enough items in inventory. Avalible: ${myProduct.stock}, your order: ${quantity}`);
    
    const myCart = await Cart.findById(req.user.cartID);
    myCart!.products.push({productID: _id as unknown as Iproduct, quantity: quantity});
    await myCart!.save();
    
    return myCart!
    }
// router.put("/addItem/:_id", isLoggedIn, async (req, res)=>{

    
    
// })
@Security("isLoggedIn")
@Put("/removeItem/{index}")
public async removeItemFromCart(@Path() index: number, @Request() req: Express.Request):Promise <Icart>{
    const myCart = await Cart.findById(req.user.cartID);
    if(index<0 || index>myCart!.products.length-1)
        throw new Error("impropper index")
    
    myCart!.products.splice(index,1);
    await myCart!.save();
    return myCart!;
    
}
// router.put("/removeItem/:index", isLoggedIn, async (req,res) =>{
    
}