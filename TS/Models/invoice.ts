import {Icart} from "../Interfaces/Icart";
import mongoose from "mongoose";
import { invoice } from "../Interfaces/Iinvoice";

const invoiceSchema = new mongoose.Schema({
    products: [{productID: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'}, quantity: Number}],
    pricePaid: Number,
})

export const Invoice = mongoose.model<invoice>("Invoice", invoiceSchema);