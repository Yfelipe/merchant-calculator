"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var merchantCost_1 = require("../models/merchantCost");
var tokenHelper_1 = require("../helpers/tokenHelper");
var calculationHelper_1 = require("../helpers/calculationHelper");
var store = new merchantCost_1.MerchantCostStore();
var uploadFile = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var costCsv, uploadPath, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!_req.files || Object.keys(_req.files).length === 0) {
                    return [2 /*return*/, res.status(400).send('No files were uploaded.')];
                }
                costCsv = _req.files.file;
                uploadPath = '/backend/uploads/merchant_cost.csv';
                //Save a copy of the file on backend/upload, this will be also used to import to db
                costCsv.mv(uploadPath, function (err) {
                    if (err)
                        return res.status(500).send(err);
                });
                return [4 /*yield*/, store.addFile()];
            case 1:
                result = _a.sent();
                res.json(result);
                return [2 /*return*/];
        }
    });
}); };
var calculate = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var calculationParams, terminal, transactionVolume, transactionCount, terminalPrice, transactionVolumePrice, transactionCountPrice, total;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                calculationParams = {
                    industry: _req.body.industry,
                    transaction_volume: _req.body.transaction_volume,
                    transaction_count: _req.body.transaction_count
                };
                return [4 /*yield*/, store.getIndustryTypeValue(calculationParams.industry, 'TERMINAL')];
            case 1:
                terminal = _a.sent();
                return [4 /*yield*/, store.getIndustryTypeValue(calculationParams.industry, 'TRANSACTION_VOLUME', calculationParams.transaction_volume)];
            case 2:
                transactionVolume = _a.sent();
                return [4 /*yield*/, store.getIndustryTypeValue(calculationParams.industry, 'TRANSACTION_COUNT', calculationParams.transaction_count)];
            case 3:
                transactionCount = _a.sent();
                if (!terminal) {
                    res.status(404).json('No values found for industry supplied');
                    return [2 /*return*/];
                }
                terminalPrice = terminal.price;
                transactionVolumePrice = transactionVolume.exact_type_price
                    ? transactionVolume.exact_type_price[1]
                    : calculationHelper_1.runInterpolation(transactionVolume, calculationParams.transaction_volume);
                transactionCountPrice = transactionCount.exact_type_price
                    ? transactionCount.exact_type_price[1]
                    : calculationHelper_1.runInterpolation(transactionCount, calculationParams.transaction_count);
                //Only sum if all values are true
                if (terminalPrice && transactionVolumePrice && transactionCountPrice) {
                    total = (terminalPrice +
                        transactionVolumePrice +
                        transactionCountPrice).toFixed(2);
                    return [2 /*return*/, res.json(total)];
                }
                else {
                    res.json('Values for parameters supplied not found');
                }
                return [2 /*return*/];
        }
    });
}); };
var merchantCostRoutes = function (app) {
    app.post('/api/upload', tokenHelper_1.verifyAdminToken, uploadFile);
    app.post('/api/calculate', tokenHelper_1.verifyToken, calculate);
};
exports["default"] = merchantCostRoutes;
