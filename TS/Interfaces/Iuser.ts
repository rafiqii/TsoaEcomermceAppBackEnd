import mongoose from "mongoose";
import { Icart } from "./Icart";
import { Iorder } from "./Iorder";
export interface Iuser{
    userName: string;
    password: string;
    isAdmin: boolean;
    isPremium: boolean;
    previousOrders: Iorder[]; // if it doesnt work change to string
    cartID: Icart; // if it doesnt work change to string
    generateToken(): any;
}
