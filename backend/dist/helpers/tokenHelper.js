"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.verifyToken = exports.verifyAdminToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var verifyAdminToken = function (req, res, next) {
    try {
        var authorizationHeader = req.headers.authorization;
        var token = authorizationHeader.split(' ')[1];
        req.body.decodedToken = jsonwebtoken_1["default"].verify(token, process.env.TOKEN_SECRET);
        if (req.body.decodedToken.user.user_type !== 'admin') {
            throw new Error('Invalid user for request');
        }
        next();
    }
    catch (err) {
        res.json("Invalid token " + err);
    }
};
exports.verifyAdminToken = verifyAdminToken;
var verifyToken = function (req, res, next) {
    try {
        var authorizationHeader = req.headers.authorization;
        var token = authorizationHeader.split(' ')[1];
        req.body.decodedToken = jsonwebtoken_1["default"].verify(token, process.env.TOKEN_SECRET);
        next();
    }
    catch (err) {
        res.json("Invalid token " + err);
    }
};
exports.verifyToken = verifyToken;
