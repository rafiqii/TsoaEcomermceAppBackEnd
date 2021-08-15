"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brand = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var brandSchema = new mongoose_1.default.Schema({
    brandName: String,
});
exports.Brand = mongoose_1.default.model("Brand", brandSchema);
