"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
// import { IGetUserAuthInfoRequest } from "../fixigTS/definitionfile"
function isLoggedIn(req, res, next) {
    var token = req.header('x-Auth');
    if (!token) {
        return res.status(401).send("Please login first");
    }
    try {
        var env = dotenv_1.default.config({ path: path_1.default.normalize(path_1.default.resolve(__dirname, "../environment/.env")) });
        var signature = process.env.jwtSignature;
        var payload = jsonwebtoken_1.default.verify(token, signature);
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
