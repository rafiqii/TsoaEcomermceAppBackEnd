import mongoose from "mongoose";
import { Iproduct } from "./Iproduct";
import cartsAndQuantity from "./IproductsInCart";

export interface Icart{
    products: cartsAndQuantity[];

}

