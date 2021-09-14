"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPremiumFunction = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// import { IGetUserAuthInfoRequest } from "../fixigTS/definitionfile"
function isPremiumFunction(req) {
    const token = req.header('x-Auth');
    if (!token) {
        return false;
    }
    try {
        const env = dotenv_1.default.config({ path: path_1.default.normalize(path_1.default.resolve(__dirname, "../environment/.env")) });
        const signature = process.env.jwtSignature;
        const payload = jsonwebtoken_1.default.verify(token, signature);
        return payload.isPremium;
    }
    catch (error) {
        return false;
    }
}
exports.isPremiumFunction = isPremiumFunction;
