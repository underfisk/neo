"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const constants_1 = require("../../constants");
require("reflect-metadata");
/**
 * Controller is the decorator to specify that the class above is
 * going to have routes and handle http requests
 * @param data
 */
function Controller(data) {
    const newData = {
        prefix: !util_1.isUndefined(data) && !util_1.isUndefined(data.prefix) ? data.prefix : '/',
        modelsInjection: !util_1.isUndefined(data) && !util_1.isUndefined(data.modelsInjection) ? data.modelsInjection : true
    };
    return (target) => {
        Reflect.defineMetadata(constants_1.HTTP_CONTROLLER, newData, target);
    };
}
exports.Controller = Controller;
