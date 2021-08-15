import { Iproduct } from "../Interfaces/Iproduct";
import { Brand } from "../Models/brand";
import Tproduct from "../Types/Tproduct";


export async function findBrand(product:Iproduct, brand:string ){
    const myBrand= await Brand.findOne({brandName: brand})
    if(!myBrand)
    {
        const newBrand = new Brand();
        newBrand.brandName= brand;
        await newBrand.save();
        product.brandName=newBrand._id;
    }
    else{
        product.brandName=myBrand._id;
    }
    return product.brandName;
}