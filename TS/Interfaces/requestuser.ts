import { Icart } from "./Icart";
import { Iuser } from "./Iuser";

export interface userPayload{
    _id:Iuser;
    isAdmin:boolean;
    isPremium:boolean;
    cartID:Icart;
}