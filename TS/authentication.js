"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
async function expressAuthentication(req, securityName, scopes) {
    let payload;
    if (securityName == "isLoggedIn") {
        const token = req.header('x-Auth');
        if (!token) {
            return Promise.reject("Please login first");
        }
        try {
            const env = dotenv_1.default.config({ path: path_1.default.normalize(path_1.default.resolve(__dirname, "../environment/.env")) });
            const signature = process.env.jwtSignature;
            payload = jsonwebtoken_1.default.verify(token, signature);
            // console.log(payload)
            if (payload == null)
                return Promise.reject("invalid token");
        }
        catch (error) {
            return Promise.reject("Someting wong");
        }
    }
    return Promise.resolve(payload);
}
exports.expressAuthentication = expressAuthentication;
