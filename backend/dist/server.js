"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var user_1 = __importDefault(require("./handlers/user"));
var merchantCost_1 = __importDefault(require("./handlers/merchantCost"));
var app = express_1["default"]();
var address = '0.0.0.0:3000';
var port = 3000;
app.use(express_fileupload_1["default"]());
//This is just for dev and local, this would not go to production
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
app.use(body_parser_1["default"].json());
user_1["default"](app);
merchantCost_1["default"](app);
app.listen(port, function () {
    console.log("starting app on: " + address);
});
