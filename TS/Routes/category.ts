import { Category } from "../Models/category";
import express, {Request, Response} from "express"
import { isLoggedIn } from "../MiddleWare/logedInAuth";
import { isAdmin } from "../MiddleWare/isAdminAuth";
import { Product } from "../Models/product";
import { Icategory } from "../Interfaces/Icategory";
import Tcategory from "../Types/Tcategory";

const router = express.Router();

// namespace Express {
//     interface Response<T> {
//       response: T
//     }
//   }
router.post("/",isLoggedIn, isAdmin, async (req: Request,res: Response): Promise <Icategory>=>{
    const myCategory= await Category.findOne({category: req.body.category});
    if(myCategory)
    {
        res.send("Category is already there")
        return myCategory;
    }
    else
    {
        const myCategory = new Category();
        myCategory.categoryName= req.body.category;
        await myCategory.save();
        res.send("Category successfully saved.")
        return myCategory;
    }
});

router.put("/:_id",isLoggedIn,isAdmin, async (req:Request,res:Response)=>{
    let category = await Category.findOne({_id: req.params._id});
    if(!(req.body.categoryName))
        return res.status(400).send("Please enter a category before proceeding");
    if(!(category))
        return res.status(404).send("category not found");
    category.categoryName=req.body.categoryName;
    await category.save();
    res.send("saved")
});

router.delete(("/:_id"),isLoggedIn,isAdmin, async (req,res)=>{  
    const category =await Category.findById(req.params._id);
    if(!(category))
        return res.send(`no category is found with the given categoryID: ${req.params._id}`);
    
    
    const product =await Product.find({categories:{ $all: [req.params._id]}});
        
    for(let j=0; j<product.length; j++){
        for(let i=0; i<product[j].categories.length; i++)
        {
            if(product[j].categories[i].categoryName == req.body.categoryName)
            {
                product[j].categories.splice(i,1);
            }
            
        }
    }
    
    await Category.findByIdAndDelete(req.params._id);
    res.send(`${category.categoryName} has been deleted`)
    
});

router.get("/",async (req,res)=>{
    res.send(await Category.find());
})

export default router;