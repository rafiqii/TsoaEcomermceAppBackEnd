import mongoose from 'mongoose';
import {Product} from '../Models/product';
import express from 'express';
import {isLoggedIn} from "../MiddleWare/logedInAuth";
import {isAdmin} from "../MiddleWare/isAdminAuth";
import {Brand} from "../Models/brand"
import { Category } from '../Models/category';
import { isPremiumFunction } from '../Functions/isPremium';
import { Icategory } from '../Interfaces/Icategory';
import { findBrand } from '../Functions/brandAdding';
import { findCat } from '../Functions/categoryAdding';
import { BodyProp, Controller, Delete, Get, Path, Post, Put, Query, Request, Route, Security, Body } from '@tsoa/runtime';
import { Iproduct } from '../Interfaces/Iproduct';

@Route("product")
export class productsRoute extends Controller{

@Get()
public async getProducts(@Request() req: Express.Request):Promise <Iproduct[]>{
    if(isPremiumFunction(req))
    {
        return (await Product.find().populate("categories brandName"));
    }
    else
    {
        const products = await Product.find({isPremium: false}).populate("categories brandName");
       return (products)
    }
}
// router.get('/',async (req, res) => {
    
// });
@Security("isLoggedIn")
@Post()
public async addAProduct(
    @BodyProp() price:number,
    @BodyProp() arabicName:string,
    @BodyProp() englishName:string,
    @BodyProp() icon:string,
    @BodyProp() brandName:string,
    @BodyProp() categories:string[],
    @BodyProp() isPremium:boolean,
    @BodyProp() stock: number
):Promise <Iproduct>{
    const product = new Product();
    // console.log(req.body);
    product.price = price;
    // console.log(product)
    product.name.ar= arabicName;
    product.name.en= englishName;
    product.icon = icon;
    product.isPremium = isPremium;
    product.stock= stock;

    //if brand avalible add its refference, if not create a new object
    product.brandName= await findBrand(product,brandName);

    //bug here FIXED
    //if categories avalible add its refference, if not create new objects
    product.categories= await findCat(product, categories)

    await product.save();
    return product;

}
// router.post('/',isLoggedIn,isAdmin , async (req,res)=>{
    
// });
@Security("isLoggedIn")
@Put("{_id}")
public async updateProduct(@Path() _id:string,
    @BodyProp() price:number,
    @BodyProp() arabicName:string,
    @BodyProp() englishName:string,
    @BodyProp() icon:string,
    // @BPropody() brandName:string,
    @BodyProp() categories:string[],
    @BodyProp() isPremium:boolean,
    @BodyProp() stock: number
):Promise <Iproduct>{

    const product =await Product.findOne({_id: _id});
    if(!product)
        throw new Error("The product that you are trying to update is not avalible, create a new product in the product menu");
    try
    {
        if(arabicName)
            product.name[0].ar= arabicName;

        if(englishName)
            product.name[0].en =englishName;

        if(price)
            product.price=price;

        if(icon)
            product.icon= icon;

        if(stock)
            product.stock=stock;

        if(!(isPremium==null)) //that is for a premuim item
            product.isPremium=isPremium;
        
        if(categories)
        {
            product.categories=await findCat(product,categories)
        }
        
        await product.save();
    }
    catch(e)
    {
        console.log(`Error: \n${e}`);
    }
    return product
}
// router.put('/:_id',isLoggedIn,isAdmin , async (req,res)=>{
    
// });
@Security("isLoggedIn")
@Delete("/deleteCategory/{_id}")
public async deleteItem(@BodyProp() categoryName: string, @Path() _id:string):Promise <Iproduct>{

    const product =await Product.findById(_id).populate("category");

    if(!product)
        throw new Error("product not found");

    if(!(categoryName))
        throw new Error("enter a category name");
    

    for(let i=0; i<product.categories.length; i++)
    {
        if((product.categories[i] as any).categoryName == categoryName)
        {
            product.categories.splice(i,1);
            return product;
        }
        
    }

    throw new Error("Category not found")

}
// router.delete("/deleteCategory/:_id", isLoggedIn, isAdmin, async (req,res)=>{

    
// });

@Security("isLoggedIn")
@Put("/restock/{_id}")
public async reStockProduct(@Path() _id:string, @BodyProp() inputStock:number)
{
    let product = await Product.findById(_id)
    if(!product)
        throw new Error("product not found");
    let stock:number=0;
    try
    {
        stock= inputStock;
    }
    catch(e)
    {
        throw new Error("This is not a number")
    }
    // console.log(typeof stock)

    if(stock==null || stock<0)
        throw new Error("please enter a positive number for stocks")

    product.stock+=stock
    product.save();
    return product

}

// router.put("/restock/:_id", isLoggedIn, isAdmin, async (req,res)=>{
    
// });

@Security("isLoggedIn")
@Delete("/deleteProduct/{_id}")
public async deleteProduct(@Path() _id:string){
    await Product.findByIdAndDelete(_id)
}
// router.delete("/deleteProduct/:_id", isLoggedIn, isAdmin, async (req,res)=>{
    
// })
}

