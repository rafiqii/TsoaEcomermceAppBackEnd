import { Brand } from "../Models/brand";
import express from "express"
import { isLoggedIn } from "../MiddleWare/logedInAuth";
import { isAdmin } from "../MiddleWare/isAdminAuth";
import { Product } from "../Models/product";
import { BodyProp, Controller, Route, Post, Put, Path, Delete, Get, Query, Body } from "tsoa";
import { Ibrand } from "../Interfaces/Ibrand";
import mongoose from "mongoose";

const router = express.Router();
@Route("/brand")
export class brandRouter extends Controller {
    @Post()
    public async addBrand(@BodyProp() brandName: string): Promise<Ibrand> {

        const mybrand = await Brand.findOne({ brandName: brandName });
        if (mybrand) {
            throw new Error("brand is already added")
        }
        else {
            const mybrand = new Brand();
            mybrand.brandName = brandName;
            await mybrand.save();
            return mybrand;
        }
    };


    // router.put("/:_id", isLoggedIn, isAdmin, async (req, res) => {
    @Put("{_id}")
    public async updateBrand(@Path() _id:string, @BodyProp() brandName:string): Promise <Ibrand>
    {
        let brand = await Brand.findOne({ _id: _id});
        
        if (!(brandName))
            throw new Error("brandName does not exist")
        if (!(brand))
            throw new Error("The brand with the given Id does not exisit")
        brand.brandName = brandName;
        await brand.save();
        return brand;
    }
    // router.delete(("/:_id"), isLoggedIn, isAdmin, async (req, res) => {
        
    @Delete("{_id}")
    public async deleteBrand(@Path() _id:string):Promise <any> 
    {
    const brand = await Brand.findById(_id);
    if (!(brand))
        throw new Error(`no brand is found with the given brandID: ${_id}`);
    const productsWithThisBrandName = await Product.findById(_id);
    if (productsWithThisBrandName) {
        throw new Error(`There are still products avalible with this brand name, please replace their brand name before deleting \n${productsWithThisBrandName}`);
    }
    else {
        await Brand.findByIdAndDelete(_id);
        return(`${brand.brandName} has been deleted`)
    }
    };
    @Get()
    public async getBrands(): Promise<Ibrand[]>{
    return await Brand.find()
    }
    
}
export default router;