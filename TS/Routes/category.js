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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoute = void 0;
const category_1 = require("../Models/category");
const express_1 = __importDefault(require("express"));
const product_1 = require("../Models/product");
const runtime_1 = require("@tsoa/runtime");
const router = express_1.default.Router();
let categoryRoute = class categoryRoute extends runtime_1.Controller {
    async createNewCategory(category) {
        const myCategory = await category_1.Category.findOne({ category: category });
        if (myCategory) {
            throw new Error("Category is already there");
        }
        else {
            const myCategory = new category_1.Category();
            myCategory.categoryName = category;
            await myCategory.save();
            return myCategory;
        }
    }
    // router.post("/",isLoggedIn, isAdmin, async (req: Request,res: Response)=>{
    // });
    async updateCategory(_id, req, categoryName) {
        let category = await category_1.Category.findOne({ _id: _id });
        if (!(categoryName))
            throw new Error("Please enter a category before proceeding");
        if (!(category))
            throw new Error("category not found");
        category.categoryName = categoryName;
        await category.save();
        return category;
    }
    // router.put("/:_id",isLoggedIn,isAdmin, async (req:Request,res:Response)=>{
    //     });
    async deleteCategorey(_id, categoryName) {
        const category = await category_1.Category.findById(_id);
        if (!(category))
            throw new Error(`no category is found with the given categoryID: ${_id}`);
        const product = await product_1.Product.find({ categories: { $all: [_id] } });
        for (let j = 0; j < product.length; j++) {
            for (let i = 0; i < product[j].categories.length; i++) {
                if (product[j].categories[i].categoryName == categoryName) {
                    product[j].categories.splice(i, 1);
                }
            }
        }
        await category_1.Category.findByIdAndDelete(_id);
        return true;
    }
    // router.delete(("/:_id"),isLoggedIn,isAdmin, async (req,res)=>{  
    //  }
    async getAllCats() {
        return (await category_1.Category.find());
    }
};
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Post(),
    __param(0, runtime_1.BodyProp())
], categoryRoute.prototype, "createNewCategory", null);
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Put("{_id}"),
    __param(0, runtime_1.Path()),
    __param(1, runtime_1.Request()),
    __param(2, runtime_1.BodyProp())
], categoryRoute.prototype, "updateCategory", null);
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Delete("{_id}"),
    __param(0, runtime_1.Path()),
    __param(1, runtime_1.BodyProp())
], categoryRoute.prototype, "deleteCategorey", null);
__decorate([
    runtime_1.Get()
], categoryRoute.prototype, "getAllCats", null);
categoryRoute = __decorate([
    runtime_1.Route("/category")
], categoryRoute);
exports.categoryRoute = categoryRoute;
exports.default = router;
