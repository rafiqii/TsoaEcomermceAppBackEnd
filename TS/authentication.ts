import * as express from "express";
import jwt, {Secret} from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import path from 'path';

export async function expressAuthentication(
    req: express.Request,
    securityName: string,
    scopes?: string[]
  ): Promise<any> {
    let payload;
      if(securityName=="isLoggedIn")
      {
          const token:string|undefined = req.header('x-Auth');
          if(!token){
              return Promise.reject("Please login first")
            }
            try{
                const env = dotenv.config({path: path.normalize(path.resolve(__dirname, "../environment/.env"))})
                const signature:Secret=process.env.jwtSignature as Secret;
        payload = jwt.verify(token, signature)
        // console.log(payload)
        if(payload == null)
            return Promise.reject("invalid token")
        
    }
    catch(error){
        return Promise.reject("Someting wong")
    }
}
    return Promise.resolve(payload)
}  