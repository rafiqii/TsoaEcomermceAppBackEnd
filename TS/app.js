"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
//Importing routes
var loging_in_1 = __importDefault(require("./login/loging in"));
var user_1 = __importDefault(require("./Routes/user"));
var product_1 = __importDefault(require("./Routes/product"));
var brand_1 = __importDefault(require("./Routes/brand"));
var category_1 = __importDefault(require("./Routes/category"));
var order_1 = __importDefault(require("./Routes/order"));
var cart_1 = __importDefault(require("./Routes/cart"));
// Creating express var
var app = express_1.default();
//extra settings
app.use(express_1.default.urlencoded({ extended: true }));
var env = dotenv_1.default.config({ path: path_1.default.normalize(path_1.default.resolve(__dirname, "../environment/.env")) });
//connect to DB
mongoose_1.default.connect(process.env.DbConnection, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.log("error detected whilst connecting to db \nError: " + err);
    }
    else
        console.log("db connection established");
});
//listening
app.listen(3000);
//connecting to routes
app.use("/user", user_1.default);
app.use("/login", loging_in_1.default);
app.use("/product", product_1.default);
app.use("/brand", brand_1.default);
app.use("/category", category_1.default);
app.use("/order", order_1.default);
app.use("/cart", cart_1.default);
