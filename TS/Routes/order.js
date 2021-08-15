"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var order_1 = require("../Models/order");
var express_1 = __importDefault(require("express"));
var logedInAuth_1 = require("../MiddleWare/logedInAuth");
var cart_1 = require("../Models/cart");
var user_1 = require("../Models/user");
var isAdminAuth_1 = require("../MiddleWare/isAdminAuth");
var invoice_1 = require("../Models/invoice");
var product_1 = require("../Models/product");
var router = express_1.default.Router();
//add dedction to stock
router.post("/buyItems", logedInAuth_1.isLoggedIn, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, myCart, cartArray, collapsedCart, myObj, quantity, i, myProducts, i, order, i, discount, vat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_1.User.findById(req.user._id)];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, cart_1.Cart.findById(req.user.cartID)];
            case 2:
                myCart = _a.sent();
                cartArray = __spreadArray([], myCart.products);
                collapsedCart = [];
                while (cartArray.length > 0) {
                    myObj = { productID: JSON.parse(JSON.stringify(cartArray[0].productID)), quantity: 0 };
                    quantity = 0;
                    //map find filter
                    for (i = 0; i < cartArray.length;) {
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
                return [4 /*yield*/, product_1.Product.find({ _id: { $in: collapsedCart.map(function (element) { return element.productID; }) } })
                    // console.log(myProducts)
                ];
            case 3:
                myProducts = _a.sent();
                // console.log(myProducts)
                for (i = 0; i < myProducts.length; i++) {
                    if (myProducts[i].stock < collapsedCart[i].quantity) {
                        return [2 /*return*/, res.status(400).send("" + myProducts[i].name.en)];
                    }
                }
                order = new order_1.Order();
                order.products = __spreadArray([], myCart.products);
                //removing stock and calculating price
                order.rawPrice = 0;
                i = 0;
                _a.label = 4;
            case 4:
                if (!(i < myProducts.length)) return [3 /*break*/, 7];
                // console.log(`product price: ${myProducts[i].price}`)
                // console.log(`quantity: ${collapsedCart[i].quantity}`)
                // console.log(`raw price: ${order.rawPrice}`)
                order.rawPrice += myProducts[i].price * collapsedCart[i].quantity;
                myProducts[i].stock -= collapsedCart[i].quantity;
                return [4 /*yield*/, myProducts[i].save()];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 4];
            case 7:
                myCart.products = [];
                discount = -1;
                vat = 1.15;
                req.user.isPremium ? discount = .5 : discount = 1;
                order.priceAfterDiscountAndVAT = order.rawPrice * discount * vat;
                order.delivered = false;
                return [4 /*yield*/, order.save()];
            case 8:
                _a.sent();
                return [4 /*yield*/, myCart.save()];
            case 9:
                _a.sent();
                user.previousOrders.push(order.id);
                return [4 /*yield*/, user.save()];
            case 10:
                _a.sent();
                res.send("items saved");
                return [2 /*return*/];
        }
    });
}); });
router.put("/orderRecieved/:_id", logedInAuth_1.isLoggedIn, isAdminAuth_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var invoice, myOrder;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                invoice = new invoice_1.Invoice();
                return [4 /*yield*/, order_1.Order.findById(req.params._id)];
            case 1:
                myOrder = _a.sent();
                if (!myOrder)
                    return [2 /*return*/, res.status(404).send("Order not found")];
                myOrder.delivered = true;
                myOrder.invoice = invoice.id;
                return [4 /*yield*/, myOrder.save()];
            case 2:
                _a.sent();
                invoice.products = __spreadArray([], myOrder.products);
                invoice.pricePaid = myOrder.priceAfterDiscountAndVAT;
                return [4 /*yield*/, invoice.save()];
            case 3:
                _a.sent();
                res.send("تم");
                return [2 /*return*/];
        }
    });
}); });
exports.default = router;
