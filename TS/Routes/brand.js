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
var brand_1 = require("../Models/brand");
var express_1 = __importDefault(require("express"));
var logedInAuth_1 = require("../MiddleWare/logedInAuth");
var isAdminAuth_1 = require("../MiddleWare/isAdminAuth");
var product_1 = require("../Models/product");
var router = express_1.default.Router();
router.post("/", logedInAuth_1.isLoggedIn, isAdminAuth_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mybrand, mybrand_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, brand_1.Brand.findOne({ brandName: req.body.brandName })];
            case 1:
                mybrand = _a.sent();
                if (!mybrand) return [3 /*break*/, 2];
                return [2 /*return*/, res.send("Brand is already there")];
            case 2:
                mybrand_1 = new brand_1.Brand();
                mybrand_1.brandName = req.body.brandName;
                return [4 /*yield*/, mybrand_1.save()];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
router.put("/:_id", logedInAuth_1.isLoggedIn, isAdminAuth_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var brand;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, brand_1.Brand.findOne({ _id: req.params._id })];
            case 1:
                brand = _a.sent();
                if (!(req.body.brandName))
                    return [2 /*return*/, res.status(400).send("Please enter a brand name before proceeding")];
                if (!(brand))
                    return [2 /*return*/, res.status(404).send("brand not found")];
                brand.brandName = req.body.brandName;
                return [4 /*yield*/, brand.save()];
            case 2:
                _a.sent();
                res.send("saved");
                return [2 /*return*/];
        }
    });
}); });
router.delete(("/:_id"), logedInAuth_1.isLoggedIn, isAdminAuth_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var brand, productsWithThisBrandName;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, brand_1.Brand.findById(req.params._id)];
            case 1:
                brand = _a.sent();
                if (!(brand))
                    return [2 /*return*/, res.send("no brand is found with the given brandID: " + req.params._id)];
                return [4 /*yield*/, product_1.Product.findById(req.params._id)];
            case 2:
                productsWithThisBrandName = _a.sent();
                if (!productsWithThisBrandName) return [3 /*break*/, 3];
                return [2 /*return*/, res.send("There are still products avalible with this brand name, please replace their brand name before deleting \n" + productsWithThisBrandName)];
            case 3: return [4 /*yield*/, brand_1.Brand.findByIdAndDelete(req.params._id)];
            case 4:
                _a.sent();
                res.send(brand.brandName + " has been deleted");
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = res).send;
                return [4 /*yield*/, brand_1.Brand.find()];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); });
exports.default = router;
