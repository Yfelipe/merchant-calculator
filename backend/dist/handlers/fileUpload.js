"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
var uploadFile = function (_req, res) {
    var costCsv;
    var uploadPath;
    if (!_req.files || Object.keys(_req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    costCsv = _req.files.file;
    uploadPath = '/backend/uploads/merchant_cost.csv';
    // Use the mv() method to place the file somewhere on your server
    costCsv.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);
        res.send('File uploaded!');
    });
};
var fileUploadRoutes = function (app) {
    app.post('/api/upload', uploadFile);
};
exports["default"] = fileUploadRoutes;
