import mongoose from "mongoose";
import { invoice } from "./Iinvoice";
import { Iproduct } from "./Iproduct";
import cartsAndQuantity from "./IproductsInCart";

export interface Iorder{
    products: cartsAndQuantity[];
    rawPrice: number;
    priceAfterDiscountAndVAT: number;
    delivered:boolean;
    invoice: invoice;
}