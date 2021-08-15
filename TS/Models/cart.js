"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var cartSchema = new mongoose_1.default.Schema({
    products: [{ productID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
});
exports.Cart = mongoose_1.default.model("Cart", cartSchema);
