import {Icategory} from "../Interfaces/Icategory";
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: String,
});

export const Category = mongoose.model<Icategory>("Category", categorySchema);