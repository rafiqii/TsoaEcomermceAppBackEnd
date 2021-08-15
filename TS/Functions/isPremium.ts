import jwt, {Secret} from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import path from 'path';
// import { IGetUserAuthInfoRequest } from "../fixigTS/definitionfile"

export function isPremiumFunction(req) {
    
    const token:string|undefined = req.header('x-Auth');
    if(!token){
        return false;
    }
    try{
        const env = dotenv.config({path: path.normalize(path.resolve(__dirname, "../environment/.env"))})
        const signature:Secret=process.env.jwtSignature as Secret;
        const payload:any = jwt.verify(token, signature)
        return payload.isPremium;
    }
    catch(error){
        return false;
    }


}