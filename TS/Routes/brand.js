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
exports.brandRouter = void 0;
const brand_1 = require("../Models/brand");
const express_1 = __importDefault(require("express"));
const product_1 = require("../Models/product");
const tsoa_1 = require("tsoa");
const router = express_1.default.Router();
let brandRouter = class brandRouter extends tsoa_1.Controller {
    async addBrand(brandName) {
        const mybrand = await brand_1.Brand.findOne({ brandName: brandName });
        if (mybrand) {
            throw new Error("brand is already added");
        }
        else {
            const mybrand = new brand_1.Brand();
            mybrand.brandName = brandName;
            await mybrand.save();
            return mybrand;
        }
    }
    ;
    // router.put("/:_id", isLoggedIn, isAdmin, async (req, res) => {
    async updateBrand(_id, brandName) {
        let brand = await brand_1.Brand.findOne({ _id: _id });
        if (!(brandName))
            throw new Error("brandName does not exist");
        if (!(brand))
            throw new Error("The brand with the given Id does not exisit");
        brand.brandName = brandName;
        await brand.save();
        return brand;
    }
    // router.delete(("/:_id"), isLoggedIn, isAdmin, async (req, res) => {
    async deleteBrand(_id) {
        const brand = await brand_1.Brand.findById(_id);
        if (!(brand))
            throw new Error(`no brand is found with the given brandID: ${_id}`);
        const productsWithThisBrandName = await product_1.Product.findById(_id);
        if (productsWithThisBrandName) {
            throw new Error(`There are still products avalible with this brand name, please replace their brand name before deleting \n${productsWithThisBrandName}`);
        }
        else {
            await brand_1.Brand.findByIdAndDelete(_id);
            return (`${brand.brandName} has been deleted`);
        }
    }
    ;
    async getBrands() {
        return await brand_1.Brand.find();
    }
};
__decorate([
    tsoa_1.Post(),
    __param(0, tsoa_1.BodyProp())
], brandRouter.prototype, "addBrand", null);
__decorate([
    tsoa_1.Put("{_id}"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.BodyProp())
], brandRouter.prototype, "updateBrand", null);
__decorate([
    tsoa_1.Delete("{_id}"),
    __param(0, tsoa_1.Path())
], brandRouter.prototype, "deleteBrand", null);
__decorate([
    tsoa_1.Get()
], brandRouter.prototype, "getBrands", null);
brandRouter = __decorate([
    tsoa_1.Route("/brand")
], brandRouter);
exports.brandRouter = brandRouter;
exports.default = router;
