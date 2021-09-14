import jwt, {Secret} from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import path from 'path';
// import { IGetUserAuthInfoRequest } from "../fixigTS/definitionfile"

export function isLoggedIn(req:Request, res:Response, next: NextFunction) {
    
    const token:string|undefined = req.header('x-Auth');
    if(!token){
        return res.status(401).send("Please login first")
    }
    try{
        const env = dotenv.config({path: path.normalize(path.resolve(__dirname, "../environment/.env"))})
        const signature:Secret=process.env.jwtSignature as Secret;
        const payload = jwt.verify(token, signature)
        // console.log(payload)
        if(payload == null)
            return res.status(400).send("invalid token")
        req.user = payload;
        next();
    }
    catch(error){
        return res.status(400).send("invalid token")
    }


}