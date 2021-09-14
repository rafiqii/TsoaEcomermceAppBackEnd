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
exports.orderRoute = void 0;
const order_1 = require("../Models/order");
const express_1 = __importDefault(require("express"));
const cart_1 = require("../Models/cart");
const user_1 = require("../Models/user");
const invoice_1 = require("../Models/invoice");
const product_1 = require("../Models/product");
const runtime_1 = require("@tsoa/runtime");
const router = express_1.default.Router();
let orderRoute = class orderRoute extends runtime_1.Controller {
    async buyItems(req) {
        const user = await user_1.User.findById(req.user._id);
        const myCart = await cart_1.Cart.findById(req.user.cartID);
        //Collapsing the cart so no reputation in ids
        let cartArray = [...myCart.products];
        let collapsedCart = [];
        while (cartArray.length > 0) {
            // console.log(`in while ${cartArray.length}`)
            const myObj = { productID: JSON.parse(JSON.stringify(cartArray[0].productID)), quantity: 0 };
            let quantity = 0;
            //map find filter
            for (let i = 0; i < cartArray.length;) {
                // console.log(myObj.productID==cartArray[i].productID)
                // console.log(`in for ${cartArray.length}`)
                // console.log(`objID: ${myObj.productID}\ncartArray:${cartArray}`)
                if (myObj.productID == cartArray[i].productID) {
                    // console.log(i);
                    // console.log(`cartArray:${cartArray[i].quantity}`)
                    myObj.quantity += cartArray[i].quantity;
                    cartArray.splice(i, 1);
                    // console.log(quantity)
                }
                else {
                    // console.log(`it is false\nobjID: ${myObj.productID}\ncartArray:${cartArray[i].productID}`)
                    i++;
                }
            }
            collapsedCart.push(myObj);
        }
        // console.log(collapsedCart)
        //checking if the stock is avalible
        const myProducts = await product_1.Product.find({ _id: { $in: collapsedCart.map(element => element.productID) } });
        // console.log(myProducts)
        for (let i = 0; i < myProducts.length; i++) {
            if (myProducts[i].stock < collapsedCart[i].quantity) {
                throw new Error(`${myProducts[i].name.en}`);
            }
        }
        const order = new order_1.Order();
        order.products = [...myCart.products];
        //removing stock and calculating price
        order.rawPrice = 0;
        for (let i = 0; i < myProducts.length; i++) {
            // console.log(`product price: ${myProducts[i].price}`)
            // console.log(`quantity: ${collapsedCart[i].quantity}`)
            // console.log(`raw price: ${order.rawPrice}`)
            order.rawPrice += myProducts[i].price * collapsedCart[i].quantity;
            myProducts[i].stock -= collapsedCart[i].quantity;
            await myProducts[i].save();
        }
        myCart.products = [];
        let discount = -1;
        const vat = 1.15;
        req.user.isPremium ? discount = .5 : discount = 1;
        order.priceAfterDiscountAndVAT = order.rawPrice * discount * vat;
        order.delivered = false;
        await order.save();
        await myCart.save();
        user.previousOrders.push(order.id);
        await user.save();
        return order;
    }
    //add dedction to stock
    // router.post("/buyItems", isLoggedIn, async (req,res)=>{
    // });
    async recievedOrder(_id) {
        const invoice = new invoice_1.Invoice();
        const myOrder = await order_1.Order.findById(_id);
        if (!myOrder)
            throw new Error("Order not found");
        myOrder.delivered = true;
        myOrder.invoice = invoice.id;
        await myOrder.save();
        invoice.products = [...myOrder.products];
        invoice.pricePaid = myOrder.priceAfterDiscountAndVAT;
        await invoice.save();
        return invoice;
    }
};
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Post("/buyItems"),
    __param(0, runtime_1.Request())
], orderRoute.prototype, "buyItems", null);
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Put("/orderRecieved/{_id}"),
    __param(0, runtime_1.Path())
], orderRoute.prototype, "recievedOrder", null);
orderRoute = __decorate([
    runtime_1.Route("order")
], orderRoute);
exports.orderRoute = orderRoute;
