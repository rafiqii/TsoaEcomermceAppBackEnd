import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import path from "path";

//Importing routes
import loginRoute from "./login/loging in"
import "./Routes/user"
import "./Routes/product"
import "./Routes/brand"
import "./Routes/category"
import "./Routes/order"
import "./Routes/cart"
import swaggerUi from "swagger-ui-express"
import "./authentication";


import { RegisterRoutes } from './routes';

// Creating express var
const app:express.Application=express();

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

RegisterRoutes(app);
//connecting to routes
// app.use("/user", userRoute);
app.use("/login",loginRoute);
// app.use("/product",productRoute);
// // app.use("/brand",brandRoute);
// app.use("/category",categoryRoute);
// app.use("/order",orderRoute);
// app.use("/cart",cartRoute);

try{
    const swagger= require("../swagger.json")
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swagger))
} catch(err){
    console.log(`error in swagger file ${err}`)
}

