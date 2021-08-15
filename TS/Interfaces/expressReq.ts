import { Request } from "express";
import { userPayload } from "./requestuser";

 interface reqUserInfo extends Request{
    user: userPayload;
}
export default reqUserInfo;