import mongoose from "mongoose";
import Tproduct from "../Types/Tproduct";
import { Ibrand } from "./Ibrand";
import { Icategory } from "./Icategory";

export interface Iproduct{
    name: 
    {
        en:string;
        ar:string;
    };
    price: number;
    icon: string;
    isPremium: boolean;
    stock:number;
    categories: Icategory[];
    brandName:Ibrand;
}