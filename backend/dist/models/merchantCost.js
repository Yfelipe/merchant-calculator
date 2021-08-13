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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.MerchantCostStore = void 0;
var database_1 = __importDefault(require("../database"));
var fs_1 = __importDefault(require("fs"));
var readline_1 = __importDefault(require("readline"));
var pg_format_1 = __importDefault(require("pg-format"));
var MerchantCostStore = /** @class */ (function () {
    function MerchantCostStore() {
    }
    MerchantCostStore.prototype.addFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fileStream, reader, merchantCostArray;
            var _this = this;
            return __generator(this, function (_a) {
                fileStream = fs_1["default"].createReadStream('/backend/uploads/merchant_cost.csv');
                reader = readline_1["default"].createInterface({ input: fileStream });
                merchantCostArray = [];
                try {
                    reader
                        .on('line', function (line) {
                        //Remove any empty space and splits to array
                        var rowArray = line.split(',').map(function (item) { return item.replace(' ', ''); });
                        //Set value to const to make it easier to understand the order
                        var industry = rowArray[0];
                        var type = rowArray[1];
                        var value = rowArray[2] === '' ? null : rowArray[2];
                        var price = rowArray[3];
                        merchantCostArray.push([industry, type, value, price]);
                    })
                        .on('close', function () { return __awaiter(_this, void 0, void 0, function () {
                        var connection;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, database_1["default"].connect()];
                                case 1:
                                    connection = _a.sent();
                                    return [4 /*yield*/, connection.query('DELETE FROM merchant_cost')];
                                case 2:
                                    _a.sent();
                                    connection.release();
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .on('close', function () { return __awaiter(_this, void 0, void 0, function () {
                        var connection, insertQuery;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    //Shift one line to remove file header
                                    merchantCostArray.shift();
                                    return [4 /*yield*/, database_1["default"].connect()];
                                case 1:
                                    connection = _a.sent();
                                    insertQuery = pg_format_1["default"]('INSERT INTO merchant_cost(industry, type, value, price) VALUES %L', merchantCostArray);
                                    return [4 /*yield*/, connection.query(insertQuery)];
                                case 2:
                                    _a.sent();
                                    connection.release();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                catch (err) {
                    throw new Error("Sorry we had an issue importing merchant cost data, error: " + err);
                }
                return [2 /*return*/, 'File added successfully'];
            });
        });
    };
    MerchantCostStore.prototype.getIndustryTypeValue = function (industry, type, value) {
        if (value === void 0) { value = null; }
        return __awaiter(this, void 0, void 0, function () {
            var connection, query, params, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        connection = _a.sent();
                        query = '';
                        params = [];
                        //If value is provided also search with value field
                        if (value) {
                            //I use 3 sub queries to get exact_type_price or null, previous_type_price or null and next_type_price or null
                            query =
                                'SELECT (SELECT ARRAY[value, price] FROM merchant_cost s1 WHERE s1.value = ($3) AND industry LIKE ($1) AND type = ($2)) AS exact_type_price,(SELECT  ARRAY[value, price] FROM merchant_cost s2 WHERE s2.value < ($3) AND industry LIKE ($1) AND type = ($2) ORDER BY value DESC LIMIT 1) AS previous_type_price, (SELECT ARRAY[value, price] FROM merchant_cost s3 WHERE s3.value > ($3) AND industry LIKE ($1) AND type = ($2) ORDER BY value ASC LIMIT 1) AS next_type_price FROM merchant_cost s WHERE industry LIKE ($1) AND type = ($2) LIMIT 1';
                            params = ["%" + industry + "%", type, value];
                        }
                        else {
                            query =
                                'SELECT price::float FROM merchant_cost WHERE industry LIKE ($1) AND type = ($2)';
                            params = ["%" + industry + "%", type];
                        }
                        return [4 /*yield*/, connection.query(query, params)];
                    case 2:
                        result = _a.sent();
                        connection.release();
                        return [2 /*return*/, result.rows[0]];
                    case 3:
                        err_1 = _a.sent();
                        throw new Error("Sorry we had an issue getting industry data, error: " + err_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return MerchantCostStore;
}());
exports.MerchantCostStore = MerchantCostStore;
