import {Ibrand} from "../Interfaces/Ibrand";
import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    brandName: String,
});

export const Brand = mongoose.model<Ibrand>("Brand", brandSchema);