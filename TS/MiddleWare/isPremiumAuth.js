"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPremuim = void 0;
// import { IGetUserAuthInfoRequest } from "../fixigTS/definitionfile"
// import { IUserInfo } from "../fixigTS/definitionfile"
function isPremuim(req, res, next) {
    if (req.user.isPremium)
        return (res.status(401).send("Please become a premuim member to access this"));
    else
        next();
}
exports.isPremuim = isPremuim;
