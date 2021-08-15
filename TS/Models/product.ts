import mongoose from "mongoose";
import {Iproduct} from "../Interfaces/Iproduct";

const productSchema= new mongoose.Schema({
    name: 
    {
        en:String,
        ar:String
    },
    price: Number,
    icon: String,
    isPremium: Boolean,
    stock:Number,
    categories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
    brandName: {type: mongoose.Schema.Types.ObjectId, ref: 'Brand'},

});
export const Product = mongoose.model<Iproduct>("Product", productSchema) 