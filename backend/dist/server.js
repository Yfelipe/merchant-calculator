"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var user_1 = __importDefault(require("./handlers/user"));
var app = express_1["default"]();
var address = '0.0.0.0:3000';
var port = 3000;
app.use(body_parser_1["default"].json());
user_1["default"](app);
app.listen(port, function () {
    console.log("starting app on: " + address);
});
