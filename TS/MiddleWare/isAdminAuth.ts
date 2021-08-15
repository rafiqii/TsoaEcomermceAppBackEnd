import express, {Request, Response, NextFunction} from "express";
// import { IGetUserAuthInfoRequest } from "../fixigTS/definitionfile"
// import { IUserInfo } from "../fixigTS/definitionfile"

export function isAdmin(req, res , next){
    if(!req.user.isAdmin)
    return(res.status(403).send("Admins only! :("))
    else
    next();
}