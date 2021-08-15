import express from "express";
import bcrypt from "bcrypt";
import {User} from "../Models/user";

const router = express.Router();
//searching for user
router.post('/', async (req, res) => {
    const logingUser =await User.findOne({userName: req.body.userName});
    if(!logingUser) {
        res.status(404).send("Username not found");
        return;
    }
    if(await bcrypt.compare(req.body.password, logingUser.password)){
        res.status(200).setHeader("x-Auth",logingUser.generateToken()).send("Logged in");
    }
    else res.status(404).send("Password incorrect");

})
export default router;