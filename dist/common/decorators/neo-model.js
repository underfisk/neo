"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const util_1 = require("util");
require("reflect-metadata");
/**
 * Model is a way of provide information seeding to your controllers/listeners
 * Neo uses MVW technique to provide models being injected into controllers or
 * listeners
 * WARNING: Do not repeat alias names otherwise it will return an unexpected reference
 * @param options
 */
function Model(options) {
    return (target) => {
        let _options = {};
        if (!util_1.isUndefined(options)) //Read it
         {
            if (options.alias == "")
                throw new Error(`Please do not provide ${options.alias} as the name for ${target['name']}`);
            _options = {
                alias: options.alias || target['name'],
                isGlobal: options.isGlobal || true,
                modelsInjection: options.modelsInjection || false
            };
        }
        else //default
            _options = {
                alias: target['name'],
                isGlobal: true,
                modelsInjection: false
            };
        //Define it
        Reflect.defineMetadata(constants_1.NEO_MVC_MODEL, _options, target);
    };
}
exports.Model = Model;
