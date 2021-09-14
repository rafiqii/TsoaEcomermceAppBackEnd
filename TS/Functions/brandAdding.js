"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBrand = void 0;
const brand_1 = require("../Models/brand");
async function findBrand(product, brand) {
    const myBrand = await brand_1.Brand.findOne({ brandName: brand });
    if (!myBrand) {
        const newBrand = new brand_1.Brand();
        newBrand.brandName = brand;
        await newBrand.save();
        product.brandName = newBrand._id;
    }
    else {
        product.brandName = myBrand._id;
    }
    return product.brandName;
}
exports.findBrand = findBrand;
