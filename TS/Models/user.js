"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const env = dotenv_1.default.config({ path: path_1.default.normalize(path_1.default.resolve(__dirname, "../environment/.env")) });
const signature = process.env.jwtSignature;
const userSchema = new mongoose_1.default.Schema({
    userName: { type: String, index: true },
    password: String,
    isAdmin: Boolean,
    isPremium: { type: Boolean, index: true },
    previousOrders: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Order" }],
    cartID: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Cart" }] // if it doesnt work change to string
});
userSchema.methods.generateToken = function () {
    const token = jsonwebtoken_1.default.sign({ _id: this._id, isAdmin: this.isAdmin, isPremium: this.isPremium, cartID: this.cartID }, signature);
    return token;
};
exports.User = mongoose_1.default.model('User', userSchema);
