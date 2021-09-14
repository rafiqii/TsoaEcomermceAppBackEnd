"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../Models/user");
const router = express_1.default.Router();
//searching for user
router.post('/', async (req, res) => {
    const logingUser = await user_1.User.findOne({ userName: req.body.userName });
    if (!logingUser) {
        res.status(404).send("Username not found");
        return;
    }
    if (await bcrypt_1.default.compare(req.body.password, logingUser.password)) {
        res.status(200).setHeader("x-Auth", logingUser.generateToken()).send("Logged in");
    }
    else
        res.status(404).send("Password incorrect");
});
exports.default = router;
