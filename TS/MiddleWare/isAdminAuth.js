"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
// import { IGetUserAuthInfoRequest } from "../fixigTS/definitionfile"
// import { IUserInfo } from "../fixigTS/definitionfile"
function isAdmin(req, res, next) {
    if (!req.user.isAdmin)
        return (res.status(403).send("Admins only! :("));
    else
        next();
}
exports.isAdmin = isAdmin;
