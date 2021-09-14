"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
//Importing routes
const loging_in_1 = __importDefault(require("./login/loging in"));
require("./Routes/user");
require("./Routes/product");
require("./Routes/brand");
require("./Routes/category");
require("./Routes/order");
require("./Routes/cart");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
require("./authentication");
const routes_1 = require("./routes");
// Creating express var
const app = express_1.default();
//extra settings
app.use(express_1.default.urlencoded({ extended: true }));
const env = dotenv_1.default.config({ path: path_1.default.normalize(path_1.default.resolve(__dirname, "../environment/.env")) });
//connect to DB
mongoose_1.default.connect(process.env.DbConnection, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) {
        console.log(`error detected whilst connecting to db \nError: ${err}`);
    }
    else
        console.log(`db connection established`);
});
//listening
app.listen(3000);
routes_1.RegisterRoutes(app);
//connecting to routes
// app.use("/user", userRoute);
app.use("/login", loging_in_1.default);
// app.use("/product",productRoute);
// // app.use("/brand",brandRoute);
// app.use("/category",categoryRoute);
// app.use("/order",orderRoute);
// app.use("/cart",cartRoute);
try {
    const swagger = require("../swagger.json");
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger));
}
catch (err) {
    console.log(`error in swagger file ${err}`);
}
