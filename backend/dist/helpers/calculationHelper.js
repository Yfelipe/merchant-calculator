"use strict";
exports.__esModule = true;
exports.runInterpolation = void 0;
var runInterpolation = function (valueObject, knownValue) {
    try {
        var beginning = valueObject.previous_type_price;
        var end = valueObject.next_type_price;
        return parseFloat(((end[1] - beginning[1]) / (end[0] - beginning[0])) *
            (knownValue - beginning[0]) +
            beginning[1]);
    }
    catch (e) {
        return;
    }
};
exports.runInterpolation = runInterpolation;
