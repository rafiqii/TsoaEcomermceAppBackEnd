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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var product_1 = require("../Models/product");
var express_1 = __importDefault(require("express"));
var logedInAuth_1 = require("../MiddleWare/logedInAuth");
var isAdminAuth_1 = require("../MiddleWare/isAdminAuth");
var isPremium_1 = require("../Functions/isPremium");
var brandAdding_1 = require("../Functions/brandAdding");
var categoryAdding_1 = require("../Functions/categoryAdding");
var router = express_1.default.Router();
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, products;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!isPremium_1.isPremiumFunction(req)) return [3 /*break*/, 2];
                // console.log('user is premium')
                _b = (_a = res).send;
                return [4 /*yield*/, product_1.Product.find().populate("categories brandName")];
            case 1:
                // console.log('user is premium')
                _b.apply(_a, [_c.sent()]);
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, product_1.Product.find({ isPremium: false }).populate("categories brandName")];
            case 3:
                products = _c.sent();
                res.send(products);
                _c.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/', logedInAuth_1.isLoggedIn, isAdminAuth_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                product = new product_1.Product();
                // console.log(req.body);
                product.price = req.body.price;
                // console.log(product)
                product.name.ar = req.body.arabicName;
                product.name.en = req.body.englishName;
                product.icon = req.body.icon;
                product.isPremium = req.body.isPremium;
                product.stock = req.body.stock;
                //if brand avalible add its refference, if not create a new object
                _a = product;
                return [4 /*yield*/, brandAdding_1.findBrand(product, req.body.brandName)];
            case 1:
                //if brand avalible add its refference, if not create a new object
                _a.brandName = _c.sent();
                //bug here FIXED
                //if categories avalible add its refference, if not create new objects
                _b = product;
                return [4 /*yield*/, categoryAdding_1.findCat(product, req.body.categories)];
            case 2:
                //bug here FIXED
                //if categories avalible add its refference, if not create new objects
                _b.categories = _c.sent();
                return [4 /*yield*/, product.save()];
            case 3:
                _c.sent();
                res.send("item added");
                return [2 /*return*/];
        }
    });
}); });
router.put('/:_id', logedInAuth_1.isLoggedIn, isAdminAuth_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, _a, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, product_1.Product.findOne({ _id: req.params._id })];
            case 1:
                product = _b.sent();
                if (!product)
                    return [2 /*return*/, res.status(404).send("The product that you are trying to update is not avalible, create a new product in the product menu")];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 6, , 7]);
                if (req.body.arabicName)
                    product.name[0].ar = req.body.arabicName;
                if (req.body.englishName)
                    product.name[0].en = req.body.englishName;
                if (req.body.price)
                    product.price = req.body.price;
                if (req.body.icon)
                    product.icon = req.body.icon;
                if (req.body.stock)
                    product.stock = req.body.stock;
                if (!(req.body.isPremium == null)) //that is for a premuim item
                    product.isPremium = req.body.isPremium;
                if (!req.body.categories) return [3 /*break*/, 4];
                _a = product;
                return [4 /*yield*/, categoryAdding_1.findCat(product, req.body.categories)];
            case 3:
                _a.categories = _b.sent();
                _b.label = 4;
            case 4: return [4 /*yield*/, product.save()];
            case 5:
                _b.sent();
                return [3 /*break*/, 7];
            case 6:
                e_1 = _b.sent();
                console.log("Error: \n" + e_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.delete("/deleteCategory/:_id", logedInAuth_1.isLoggedIn, isAdminAuth_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, product_1.Product.findById(req.params._id).populate("category")];
            case 1:
                product = _a.sent();
                if (!product)
                    return [2 /*return*/, res.status(404).send("product not found")];
                if (!(req.body.categoryName))
                    return [2 /*return*/, res.status(400).send("enter a category name")];
                for (i = 0; i < product.categories.length; i++) {
                    if (product.categories[i].categoryName == req.body.categoryName) {
                        product.categories.splice(i, 1);
                        return [2 /*return*/, res.send("category removed from the product")];
                    }
                }
                res.send("Category not found");
                return [2 /*return*/];
        }
    });
}); });
router.put("/restock/:_id", logedInAuth_1.isLoggedIn, isAdminAuth_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, stock;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, product_1.Product.findById(req.params._id)];
            case 1:
                product = _a.sent();
                if (!product)
                    return [2 /*return*/, res.status(404).send("product not found")];
                stock = 0;
                try {
                    stock = parseInt(req.body.stock);
                }
                catch (e) {
                    return [2 /*return*/, res.send("This is not a number")];
                }
                // console.log(typeof stock)
                if (stock == null || stock < 0)
                    return [2 /*return*/, res.send("please enter a positive number for stocks")];
                product.stock += stock;
                res.send("product has been restocked");
                product.save();
                return [2 /*return*/];
        }
    });
}); });
router.delete("/deleteProduct/:_id", logedInAuth_1.isLoggedIn, isAdminAuth_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, product_1.Product.findByIdAndDelete(req.params._id)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.default = router;
