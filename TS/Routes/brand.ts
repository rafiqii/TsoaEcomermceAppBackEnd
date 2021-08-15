import { Brand } from "../Models/brand";
import express from "express"
import { isLoggedIn } from "../MiddleWare/logedInAuth";
import { isAdmin } from "../MiddleWare/isAdminAuth";
import { Product } from "../Models/product";

const router = express.Router();

router.post("/",isLoggedIn, isAdmin, async (req,res)=>{
    const mybrand= await Brand.findOne({brandName: req.body.brandName});
    if(mybrand)
        return res.send("Brand is already there")
    else
    {
        const mybrand = new Brand();
        mybrand.brandName= req.body.brandName;
        await mybrand.save();
    }
});

router.put("/:_id",isLoggedIn,isAdmin, async (req,res)=>{
    let brand = await Brand.findOne({_id: req.params._id});
    if(!(req.body.brandName))
        return res.status(400).send("Please enter a brand name before proceeding");
    if(!(brand))
        return res.status(404).send("brand not found");
    brand.brandName=req.body.brandName;
    await brand.save();
    res.send("saved")
});

router.delete(("/:_id"),isLoggedIn,isAdmin, async (req,res)=>{  
    const brand =await Brand.findById(req.params._id);
    if(!(brand))
        return res.send(`no brand is found with the given brandID: ${req.params._id}`);
    const productsWithThisBrandName= await Product.findById(req.params._id);
    if(productsWithThisBrandName)
    {
        return res.send(`There are still products avalible with this brand name, please replace their brand name before deleting \n${productsWithThisBrandName}`);
    }
    else
    {
        await Brand.findByIdAndDelete(req.params._id);
        res.send(`${brand.brandName} has been deleted`)
    }
});

router.get("/", async (req,res)=>{
    res.send(await Brand.find());
})
export default router;