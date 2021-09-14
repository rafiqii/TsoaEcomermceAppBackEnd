"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../Models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const cart_1 = require("../Models/cart");
const runtime_1 = require("@tsoa/runtime");
const router = express_1.default.Router();
//create a new user
let userRoute = class userRoute extends runtime_1.Controller {
    // router.post('/',async (req, res) => {
    async createAccount(userName, password) {
        //input validation
        let inputLength = 0;
        let Length;
        (function (Length) {
            Length[Length["ShortUserName"] = 1] = "ShortUserName";
            Length[Length["ShortPassword"] = 2] = "ShortPassword";
            Length[Length["ShortUserNameandPassword"] = 3] = "ShortUserNameandPassword";
            Length[Length["LongUserName"] = 10] = "LongUserName";
            Length[Length["LongPassword"] = 20] = "LongPassword";
            Length[Length["LongUserNameandPassword"] = 30] = "LongUserNameandPassword";
            Length[Length["ShortUserNameandLongPasswords"] = 21] = "ShortUserNameandLongPasswords";
            Length[Length["ShortPasswordandLongUserName"] = 12] = "ShortPasswordandLongUserName";
        })(Length || (Length = {}));
        if (userName.length < 4)
            inputLength += Length.ShortUserName;
        if (password.length < 6)
            inputLength += Length.ShortPassword;
        if (userName.length > 15)
            inputLength += Length.LongUserName;
        if (password.length > 30)
            inputLength += Length.LongPassword;
        //Checking inpute length
        switch (inputLength) {
            case Length.ShortUserNameandPassword:
                return (`User name and password are too short. 4 < userName < 15 , 6 < password < 30`);
            case Length.ShortUserName:
                return (`User name is too short. 4 < userName < 15 `);
            case Length.ShortPassword:
                return (`Password is too short. 6 < password < 30`);
            case Length.LongUserNameandPassword:
                return (`User name and password are too Long. 4 < userName < 15 , 6 < password < 30`);
            case Length.LongUserName:
                return (`User name is too long. 4 < userName < 15`);
            case Length.LongPassword:
                return (`Password is too long. 6 < password < 30`);
            case Length.ShortPasswordandLongUserName:
                return (`User name is long password is short. 4 < userName < 15 , 6 < password < 30`);
            case Length.ShortUserNameandLongPasswords:
                return (`User name is short and password is long. 4 < userName < 15 , 6 < password < 30`);
        }
        if (await user_1.User.findOne({ userName: userName })) {
            throw new Error("UserName is taken, please choose another");
        }
        const user = new user_1.User();
        user.userName = userName;
        user.password = await bcrypt_1.default.hash(password, await bcrypt_1.default.genSalt(10));
        user.isPremium = false;
        user.isAdmin = false;
        //creating a new cart
        const userCart = new cart_1.Cart();
        user.cartID = userCart._id;
        await userCart.save();
        await user.save();
        // console.log(user);
        await user_1.User.createIndexes({ userName: 1 });
        return ("User created");
    }
    async setAsAdmin(_id) {
        // router.put("/setAsAdmin/:_id",isLoggedIn, isAdmin,async (req,res)=>{
        let user = await user_1.User.findOne({ _id: _id });
        if (!user)
            return ("No user found with this ID");
        if (user.isAdmin)
            return ("User is already Admin");
        else {
            user.isAdmin = true;
            await user.save();
            return ("User is now Admin");
        }
    }
    async removeAdmin(_id) {
        // router.put("/removeAdmin/:_id",isLoggedIn, isAdmin,async (req,res)=>{
        let user = await user_1.User.findOne({ _id: _id });
        if (!user)
            return ("No user found with this ID");
        if (user.isAdmin) {
            user.isAdmin = false;
            await user.save();
            return ("User is now Demoted");
        }
        else {
            return ("User is not an admin anyway");
        }
    }
    // router.put("/subscribe",isLoggedIn,async (req,res)=>{
    async subscribe(_id) {
        let user = await user_1.User.findOne({ _id: _id });
        if (user.isPremium) {
            // console.log(user)
            return ("User is already premium");
        }
        else {
            user.isPremium = true;
            await user.save();
            return ("User is now Premium");
        }
    }
    // router.put("/unsubscribe",isLoggedIn,async (req,res)=>{
    async unsubscribe(_id) {
        let user = await user_1.User.findOne({ _id: _id });
        // console.log(user);
        if (user.isPremium) {
            user.isPremium = false;
            await user.save();
            return ("User now unsubscribed");
        }
        else {
            return ("User is not a premium to unsubscribe");
        }
    }
};
__decorate([
    runtime_1.Post(),
    __param(0, runtime_1.BodyProp()),
    __param(1, runtime_1.BodyProp())
], userRoute.prototype, "createAccount", null);
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Put("/setAsAdmin/{_id}"),
    __param(0, runtime_1.Path())
], userRoute.prototype, "setAsAdmin", null);
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Put("/removeAdmin/{_id}"),
    __param(0, runtime_1.Path())
], userRoute.prototype, "removeAdmin", null);
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Put("/subscribe/{_id}"),
    __param(0, runtime_1.Path())
], userRoute.prototype, "subscribe", null);
__decorate([
    runtime_1.Security("isLoggedIn"),
    runtime_1.Put("/unsubscribe/{_id}"),
    __param(0, runtime_1.Path())
], userRoute.prototype, "unsubscribe", null);
userRoute = __decorate([
    runtime_1.Route("user")
], userRoute);
exports.userRoute = userRoute;
