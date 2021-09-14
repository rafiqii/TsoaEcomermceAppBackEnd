import { Icategory } from "../Interfaces/Icategory";
import { Iproduct } from "../Interfaces/Iproduct";
import { Category } from "../Models/category";



export async function findCat(product:Iproduct, inputCategory: string[])
{
    let categories:string[]=[];
    if(typeof(inputCategory)=="string")
    {
        categories.push(inputCategory)
    }
    else{
        categories = [...inputCategory]
    }

    for(let i=0;i<categories.length; i++){
        const myCategory =await Category.findOne({categoryName: categories[i]})
        if(!myCategory)
        {
            
            const newCategory = new Category();
            newCategory.categoryName= categories[i];
            await newCategory.save();
            product.categories.push(newCategory._id);
        }
        else{
            product.categories.push(myCategory._id);
        }    

    };
    return product.categories
}