import mongoose from "mongoose";
import {Iorder} from "../Interfaces/Iorder";

const orderSchema = new mongoose.Schema({
    products: [{productID: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'}, quantity: Number}], //Refferences the productID
    invoice: {type: mongoose.Schema.Types.ObjectId, ref: 'Invoice'},
    delivered:Boolean,
    rawPrice: Number,
    priceAfterDiscountAndVAT: Number
});

export const Order = mongoose.model<Iorder>('Order', orderSchema)
