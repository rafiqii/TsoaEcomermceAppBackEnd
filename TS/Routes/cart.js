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
exports.cartRouter = void 0;
const cart_1 = require("../Models/cart");
const product_1 = require("../Models/product");
const runtime_1 = require("@tsoa/runtime");
let cartRouter = class cartRouter extends runtime_1.Controller {
    async getCart(req) {
        const myCart = await cart_1.Cart.findById(req.user.cartID).populate({
            path: 'products',
            populate: 'productID'
        });
        let totalPrice = 0;
        // console.log(totalPrice)
        // console.log(myCart);
        for (let i = 0; i < myCart.products.length; i++) {
            totalPrice += myCart.products[i].productID.price * myCart.products[i].quantity;
            // console.log(totalPrice)
        }
        // res.send(`${myCart}\nTotal price before discount is:${totalPrice}`);
        return myCart;
    }
    // router.get("/", isLoggedIn, async (req,res)=>{
    // });
    async addItemToCart(_id, req, quantity) {
        const myProduct = await product_1.Product.findById(_id);
        if (!myProduct)
            throw new Error("product was not found");
        if (myProduct.isPremium && !(req.user.isPremium)) {
            // console.log(req.user)
            throw new Error("subscribe to access this product");
        }
        if (quantity)
            throw new Error("enter the quantity of your product");
        //Subtracting from product stock is done in order
        if (quantity > myProduct.stock)
            throw new Error(`Not enough items in inventory. Avalible: ${myProduct.stock}, your order: ${quantity}`);
        const myCart = await cart_1.Cart.findById(req.user.cartID);
        myCart.products.push({ productID: _id, quantity: quantity });
        await myCart.save();
        return myCart;
    }
    // router.put("/addItem/:_id", isLoggedIn, async (req, res)=>{
    // })
    async removeItemFromCart(index, req) {
        const myCart = await cart_1.Cart.findById(req.user.cartID);
        if (index < 0 || index > myCart.products.length - 1)
            throw new Error("impropper index");
        myCart.products.splice(index, 1);
        await myCart.save();
        return myCart;
    }
};
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Get(),
    __param(0, runtime_1.Request())
], cartRouter.prototype, "getCart", null);
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Put("addItem/{_id}"),
    __param(0, runtime_1.Path()),
    __param(1, runtime_1.Request()),
    __param(2, runtime_1.BodyProp())
], cartRouter.prototype, "addItemToCart", null);
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Put("/removeItem/{index}"),
    __param(0, runtime_1.Path()),
    __param(1, runtime_1.Request())
], cartRouter.prototype, "removeItemFromCart", null);
cartRouter = __decorate([
    runtime_1.Route("/cart")
], cartRouter);
exports.cartRouter = cartRouter;
