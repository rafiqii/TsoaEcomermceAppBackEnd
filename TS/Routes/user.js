"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_1 = require("../Models/user");
var bcrypt_1 = __importDefault(require("bcrypt"));
var logedInAuth_1 = require("../MiddleWare/logedInAuth");
var isAdminAuth_1 = require("../MiddleWare/isAdminAuth");
var cart_1 = require("../Models/cart");
var router = express_1.default.Router();
//create a new user
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var inputLength, Length, user, _a, _b, _c, _d, userCart;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                inputLength = 0;
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
                if (req.body.userName.length < 4)
                    inputLength += Length.ShortUserName;
                if (req.body.password.length < 6)
                    inputLength += Length.ShortPassword;
                if (req.body.userName.length > 15)
                    inputLength += Length.LongUserName;
                if (req.body.password.length > 30)
                    inputLength += Length.LongPassword;
                //Checking inpute length
                switch (inputLength) {
                    case Length.ShortUserNameandPassword:
                        res.send("User name and password are too short. 4 < userName < 15 , 6 < password < 30").status(409);
                        return [2 /*return*/];
                    case Length.ShortUserName:
                        res.send("User name is too short. 4 < userName < 15 ").status(409);
                        return [2 /*return*/];
                    case Length.ShortPassword:
                        res.send("Password is too short. 6 < password < 30").status(409);
                        return [2 /*return*/];
                    case Length.LongUserNameandPassword:
                        res.send("User name and password are too Long. 4 < userName < 15 , 6 < password < 30").status(409);
                        return [2 /*return*/];
                    case Length.LongUserName:
                        res.send("User name is too long. 4 < userName < 15").status(409);
                        return [2 /*return*/];
                    case Length.LongPassword:
                        res.send("Password is too long. 6 < password < 30").status(409);
                        return [2 /*return*/];
                    case Length.ShortPasswordandLongUserName:
                        res.send("User name is long password is short. 4 < userName < 15 , 6 < password < 30").status(409);
                        return [2 /*return*/];
                    case Length.ShortUserNameandLongPasswords:
                        res.send("User name is short and password is long. 4 < userName < 15 , 6 < password < 30").status(409);
                        return [2 /*return*/];
                }
                return [4 /*yield*/, user_1.User.findOne({ userName: req.body.userName })];
            case 1:
                if (_e.sent()) {
                    return [2 /*return*/, res.send("UserName is taken, please choose another")];
                }
                user = new user_1.User();
                user.userName = req.body.userName;
                _a = user;
                _c = (_b = bcrypt_1.default).hash;
                _d = [req.body.password];
                return [4 /*yield*/, bcrypt_1.default.genSalt(10)];
            case 2: return [4 /*yield*/, _c.apply(_b, _d.concat([_e.sent()]))];
            case 3:
                _a.password = _e.sent();
                user.isPremium = false;
                user.isAdmin = false;
                userCart = new cart_1.Cart();
                user.cartID = userCart._id;
                return [4 /*yield*/, userCart.save()];
            case 4:
                _e.sent();
                return [4 /*yield*/, user.save()];
            case 5:
                _e.sent();
                // console.log(user);
                res.send('User created');
                return [2 /*return*/];
        }
    });
}); });
router.put("/setAsAdmin/:_id", logedInAuth_1.isLoggedIn, isAdminAuth_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_1.User.findOne({ _id: req.params._id })];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).send("No user found with this ID")];
                if (!user.isAdmin) return [3 /*break*/, 2];
                return [2 /*return*/, res.status(409).send("User is already Admin")];
            case 2:
                user.isAdmin = true;
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                return [2 /*return*/, res.status(200).send("User is now Admin")];
        }
    });
}); });
router.put("/removeAdmin/:_id", logedInAuth_1.isLoggedIn, isAdminAuth_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_1.User.findOne({ _id: req.params._id })];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).send("No user found with this ID")];
                if (!user.isAdmin) return [3 /*break*/, 3];
                user.isAdmin = false;
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).send("User is now Demoted")];
            case 3: return [2 /*return*/, res.status(409).send("User is not an admin anyway")];
        }
    });
}); });
router.put("/subscribe", logedInAuth_1.isLoggedIn, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_1.User.findOne({ _id: req.user._id })];
            case 1:
                user = _a.sent();
                if (!user.isPremium) return [3 /*break*/, 2];
                // console.log(user)
                return [2 /*return*/, res.status(409).send("User is already premium")];
            case 2:
                user.isPremium = true;
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                return [2 /*return*/, res.status(200).send("User is now Premium")];
        }
    });
}); });
router.put("/unsubscribe", logedInAuth_1.isLoggedIn, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_1.User.findOne({ _id: req.user._id })];
            case 1:
                user = _a.sent();
                if (!user.isPremium) return [3 /*break*/, 3];
                user.isPremium = false;
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(409).send("User now unsubscribed")];
            case 3: return [2 /*return*/, res.status(200).send("User is not a premium to unsubscribe")];
        }
    });
}); });
exports.default = router;
