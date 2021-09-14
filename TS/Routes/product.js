"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRoute = void 0;
const product_1 = require("../Models/product");
const isPremium_1 = require("../Functions/isPremium");
const brandAdding_1 = require("../Functions/brandAdding");
const categoryAdding_1 = require("../Functions/categoryAdding");
const runtime_1 = require("@tsoa/runtime");
let productsRoute = class productsRoute extends runtime_1.Controller {
    async getProducts(req) {
        if (isPremium_1.isPremiumFunction(req)) {
            return (await product_1.Product.find().populate("categories brandName"));
        }
        else {
            const products = await product_1.Product.find({ isPremium: false }).populate("categories brandName");
            return (products);
        }
    }
    // router.get('/',async (req, res) => {
    // });
    async addAProduct(price, arabicName, englishName, icon, brandName, categories, isPremium, stock) {
        const product = new product_1.Product();
        // console.log(req.body);
        product.price = price;
        // console.log(product)
        product.name.ar = arabicName;
        product.name.en = englishName;
        product.icon = icon;
        product.isPremium = isPremium;
        product.stock = stock;
        //if brand avalible add its refference, if not create a new object
        product.brandName = await brandAdding_1.findBrand(product, brandName);
        //bug here FIXED
        //if categories avalible add its refference, if not create new objects
        product.categories = await categoryAdding_1.findCat(product, categories);
        await product.save();
        return product;
    }
    // router.post('/',isLoggedIn,isAdmin , async (req,res)=>{
    // });
    async updateProduct(_id, price, arabicName, englishName, icon, 
    // @BPropody() brandName:string,
    categories, isPremium, stock) {
        const product = await product_1.Product.findOne({ _id: _id });
        if (!product)
            throw new Error("The product that you are trying to update is not avalible, create a new product in the product menu");
        try {
            if (arabicName)
                product.name[0].ar = arabicName;
            if (englishName)
                product.name[0].en = englishName;
            if (price)
                product.price = price;
            if (icon)
                product.icon = icon;
            if (stock)
                product.stock = stock;
            if (!(isPremium == null)) //that is for a premuim item
                product.isPremium = isPremium;
            if (categories) {
                product.categories = await categoryAdding_1.findCat(product, categories);
            }
            await product.save();
        }
        catch (e) {
            console.log(`Error: \n${e}`);
        }
        return product;
    }
    // router.put('/:_id',isLoggedIn,isAdmin , async (req,res)=>{
    // });
    async deleteItem(categoryName, _id) {
        const product = await product_1.Product.findById(_id).populate("category");
        if (!product)
            throw new Error("product not found");
        if (!(categoryName))
            throw new Error("enter a category name");
        for (let i = 0; i < product.categories.length; i++) {
            if (product.categories[i].categoryName == categoryName) {
                product.categories.splice(i, 1);
                return product;
            }
        }
        throw new Error("Category not found");
    }
    // router.delete("/deleteCategory/:_id", isLoggedIn, isAdmin, async (req,res)=>{
    // });
    async reStockProduct(_id, inputStock) {
        let product = await product_1.Product.findById(_id);
        if (!product)
            throw new Error("product not found");
        let stock = 0;
        try {
            stock = inputStock;
        }
        catch (e) {
            throw new Error("This is not a number");
        }
        // console.log(typeof stock)
        if (stock == null || stock < 0)
            throw new Error("please enter a positive number for stocks");
        product.stock += stock;
        product.save();
        return product;
    }
    // router.put("/restock/:_id", isLoggedIn, isAdmin, async (req,res)=>{
    // });
    async deleteProduct(_id) {
        await product_1.Product.findByIdAndDelete(_id);
    }
};
__decorate([
    runtime_1.Get(),
    __param(0, runtime_1.Request())
], productsRoute.prototype, "getProducts", null);
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Post(),
    __param(0, runtime_1.BodyProp()),
    __param(1, runtime_1.BodyProp()),
    __param(2, runtime_1.BodyProp()),
    __param(3, runtime_1.BodyProp()),
    __param(4, runtime_1.BodyProp()),
    __param(5, runtime_1.BodyProp()),
    __param(6, runtime_1.BodyProp()),
    __param(7, runtime_1.BodyProp())
], productsRoute.prototype, "addAProduct", null);
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Put("{_id}"),
    __param(0, runtime_1.Path()),
    __param(1, runtime_1.BodyProp()),
    __param(2, runtime_1.BodyProp()),
    __param(3, runtime_1.BodyProp()),
    __param(4, runtime_1.BodyProp()),
    __param(5, runtime_1.BodyProp()),
    __param(6, runtime_1.BodyProp()),
    __param(7, runtime_1.BodyProp())
], productsRoute.prototype, "updateProduct", null);
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Delete("/deleteCategory/{_id}"),
    __param(0, runtime_1.BodyProp()),
    __param(1, runtime_1.Path())
], productsRoute.prototype, "deleteItem", null);
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Put("/restock/{_id}"),
    __param(0, runtime_1.Path()),
    __param(1, runtime_1.BodyProp())
], productsRoute.prototype, "reStockProduct", null);
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Delete("/deleteProduct/{_id}"),
    __param(0, runtime_1.Path())
], productsRoute.prototype, "deleteProduct", null);
productsRoute = __decorate([
    runtime_1.Route("product")
], productsRoute);
exports.productsRoute = productsRoute;
