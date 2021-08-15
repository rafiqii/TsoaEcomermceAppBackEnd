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

const router = express.Router();

router.get('/',async (req, res) => {
    if(isPremiumFunction(req))
    {
        // console.log('user is premium')
        res.send(await Product.find().populate("categories brandName"));
    }
    else
    {
        const products = await Product.find({isPremium: false}).populate("categories brandName");
        res.send(products)
    }
});

router.post('/',isLoggedIn,isAdmin , async (req,res)=>{
    const product = new Product();
    // console.log(req.body);
    product.price = req.body.price;
    // console.log(product)
    product.name.ar= req.body.arabicName;
    product.name.en= req.body.englishName;
    product.icon = req.body.icon;
    product.isPremium = req.body.isPremium;
    product.stock=req.body.stock;

    //if brand avalible add its refference, if not create a new object
    product.brandName= await findBrand(product,req.body.brandName);

    //bug here FIXED
    //if categories avalible add its refference, if not create new objects
    product.categories= await findCat(product, req.body.categories)

    await product.save();
    res.send("item added");

});

router.put('/:_id',isLoggedIn,isAdmin , async (req,res)=>{
    const product =await Product.findOne({_id: req.params._id});
    if(!product)
        return res.status(404).send("The product that you are trying to update is not avalible, create a new product in the product menu");
    try
    {
        if(req.body.arabicName)
            product.name[0].ar= req.body.arabicName;

        if(req.body.englishName)
            product.name[0].en =req.body.englishName;

        if(req.body.price)
            product.price=req.body.price;

        if(req.body.icon)
            product.icon= req.body.icon;

        if(req.body.stock)
            product.stock= req.body.stock;

        if(!(req.body.isPremium==null)) //that is for a premuim item
            product.isPremium=req.body.isPremium;
        
        if(req.body.categories)
        {
            product.categories=await findCat(product,req.body.categories)
        }
        
        await product.save();
    }
    catch(e)
    {
        console.log(`Error: \n${e}`);
    }
});

router.delete("/deleteCategory/:_id", isLoggedIn, isAdmin, async (req,res)=>{

    const product =await Product.findById(req.params._id).populate("category");

    if(!product)
        return res.status(404).send("product not found");

    if(!(req.body.categoryName))
        return res.status(400).send("enter a category name");
    

    for(let i=0; i<product.categories.length; i++)
    {
        if((product.categories[i] as any).categoryName == req.body.categoryName)
        {
            product.categories.splice(i,1);
            return res.send("category removed from the product")
        }
        
    }

    res.send("Category not found")

});

router.put("/restock/:_id", isLoggedIn, isAdmin, async (req,res)=>{
    let product = await Product.findById(req.params._id)
    if(!product)
        return res.status(404).send("product not found");
    let stock:any=0;
    try
    {
        stock= parseInt(req.body.stock)
    }
    catch(e)
    {
        return res.send("This is not a number")
    }
    // console.log(typeof stock)

    if(stock==null || stock<0)
        return res.send("please enter a positive number for stocks")

    product.stock+=stock
    res.send("product has been restocked")
    product.save();

});

router.delete("/deleteProduct/:_id", isLoggedIn, isAdmin, async (req,res)=>{
    await Product.findByIdAndDelete(req.params._id)
})

export default router;
