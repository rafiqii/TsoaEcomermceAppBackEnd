import {Icart} from "../Interfaces/Icart";
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [{productID: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'}, quantity: Number}],
})

export const Cart = mongoose.model<Icart>("Cart", cartSchema);