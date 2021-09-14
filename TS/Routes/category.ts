import { Category } from "../Models/category";
import express, { Response } from "express"
import { isLoggedIn } from "../MiddleWare/logedInAuth";
import { isAdmin } from "../MiddleWare/isAdminAuth";
import { Product } from "../Models/product";
import { Icategory } from "../Interfaces/Icategory";
import Tcategory from "../Types/Tcategory";
import { Controller, Delete, Get, Path, Post, Put, Query, Request, Route, Security, Body, BodyProp } from "@tsoa/runtime";
import mongoose from "mongoose"

const router = express.Router();


@Route("/category")
export class categoryRoute extends Controller {
    @Security("isLoggedIn")
    @Post()
    public async createNewCategory(@BodyProp() category: string): Promise<Icategory> {
        const myCategory = await Category.findOne({ category: category });
        if (myCategory) {
            throw new Error("Category is already there")
        }
        else {
            const myCategory = new Category();
            myCategory.categoryName = category;
            await myCategory.save();
            return myCategory;
        }
    }


    // router.post("/",isLoggedIn, isAdmin, async (req: Request,res: Response)=>{

    // });
    @Security("isLoggedIn")
    @Put("{_id}")
    public async updateCategory(@Path() _id: number, @Request() req: Express.Request, @BodyProp() categoryName: string): Promise<Icategory> {
        let category = await Category.findOne({ _id: _id });
        if (!(categoryName))
            throw new Error("Please enter a category before proceeding");
        if (!(category))
            throw new Error("category not found");
        category.categoryName = categoryName;
        await category.save();
        return category;

    }
    // router.put("/:_id",isLoggedIn,isAdmin, async (req:Request,res:Response)=>{
    //     });



    @Security("isLoggedIn")
    @Delete("{_id}")
    public async deleteCategorey(@Path() _id: string,@BodyProp() categoryName:string): Promise<boolean> {
        const category = await Category.findById(_id);
        if (!(category))
            throw new Error(`no category is found with the given categoryID: ${_id}`);


        const product = await Product.find({ categories: { $all: [_id] } });

        for (let j = 0; j < product.length; j++) {
            for (let i = 0; i < product[j].categories.length; i++) {
                if (product[j].categories[i].categoryName == categoryName) {
                    product[j].categories.splice(i, 1);
                }

            }
        }
        await Category.findByIdAndDelete(_id);
        return true;
    }
    // router.delete(("/:_id"),isLoggedIn,isAdmin, async (req,res)=>{  
    //  }

    @Get()
    public async getAllCats():Promise<Icategory[]>{

        return (await Category.find());
    }
    // router.get("/", async (req, res) => {
    // })
    

}

export default router;