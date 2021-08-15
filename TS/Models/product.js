"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var productSchema = new mongoose_1.default.Schema({
    name: {
        en: String,
        ar: String
    },
    price: Number,
    icon: String,
    isPremium: Boolean,
    stock: Number,
    categories: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Category' }],
    brandName: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Brand' },
});
exports.Product = mongoose_1.default.model("Product", productSchema);
