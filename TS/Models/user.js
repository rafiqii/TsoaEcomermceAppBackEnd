"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var env = dotenv_1.default.config({ path: path_1.default.normalize(path_1.default.resolve(__dirname, "../environment/.env")) });
var signature = process.env.jwtSignature;
var userSchema = new mongoose_1.default.Schema({
    userName: String,
    password: String,
    isAdmin: Boolean,
    isPremium: Boolean,
    previousOrders: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Order" }],
    cartID: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Cart" }] // if it doesnt work change to string
});
userSchema.methods.generateToken = function () {
    var token = jsonwebtoken_1.default.sign({ _id: this._id, isAdmin: this.isAdmin, isPremium: this.isPremium, cartID: this.cartID }, signature);
    return token;
};
exports.User = mongoose_1.default.model('User', userSchema);
