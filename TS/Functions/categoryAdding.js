"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCat = void 0;
const category_1 = require("../Models/category");
async function findCat(product, inputCategory) {
    let categories = [];
    if (typeof (inputCategory) == "string") {
        categories.push(inputCategory);
    }
    else {
        categories = [...inputCategory];
    }
    for (let i = 0; i < categories.length; i++) {
        const myCategory = await category_1.Category.findOne({ categoryName: categories[i] });
        if (!myCategory) {
            const newCategory = new category_1.Category();
            newCategory.categoryName = categories[i];
            await newCategory.save();
            product.categories.push(newCategory._id);
        }
        else {
            product.categories.push(myCategory._id);
        }
    }
    ;
    return product.categories;
}
exports.findCat = findCat;
