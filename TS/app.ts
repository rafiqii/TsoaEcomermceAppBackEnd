import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import path from "path";

//Importing routes
import loginRoute from "./login/loging in"
import userRoute from "./Routes/user"
import productRoute from "./Routes/product"
import brandRoute from "./Routes/brand"
import categoryRoute from "./Routes/category"
import orderRoute from "./Routes/order"
import cartRoute from "./Routes/cart"

// Creating express var
const app=express();

//extra settings
app.use(express.urlencoded({extended: true}));


const env = dotenv.config({path: path.normalize(path.resolve(__dirname, "../environment/.env"))})

//connect to DB
mongoose.connect(process.env.DbConnection!, {useNewUrlParser: true, useUnifiedTopology: true}, err => {
    if (err) {
        console.log(`error detected whilst connecting to db \nError: ${err}`);
    }
    else console.log(`db connection established`);
});

//listening
app.listen(3000);

//connecting to routes
app.use("/user", userRoute);
app.use("/login",loginRoute);
app.use("/product",productRoute);
app.use("/brand",brandRoute);
app.use("/category",categoryRoute);
app.use("/order",orderRoute);
app.use("/cart",cartRoute);



