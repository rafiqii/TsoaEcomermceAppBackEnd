"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// import { IGetUserAuthInfoRequest } from "../fixigTS/definitionfile"
function isLoggedIn(req, res, next) {
    const token = req.header('x-Auth');
    if (!token) {
        return res.status(401).send("Please login first");
    }
    try {
        const env = dotenv_1.default.config({ path: path_1.default.normalize(path_1.default.resolve(__dirname, "../environment/.env")) });
        const signature = process.env.jwtSignature;
        const payload = jsonwebtoken_1.default.verify(token, signature);
        // console.log(payload)
        if (payload == null)
            return res.status(400).send("invalid token");
        req.user = payload;
        next();
    }
    catch (error) {
        return res.status(400).send("invalid token");
    }
}
exports.isLoggedIn = isLoggedIn;
