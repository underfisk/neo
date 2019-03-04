"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
require("reflect-metadata");
/**
 * Middleware especificies whether you want a function to be called before
 * the given route below
 *
 * @example Middleware([yourExternalFunction1, 2,3..])
 * @param fn
 */
function Middleware(fns) {
    return (target, key, descriptor) => {
        Reflect.defineMetadata(constants_1.HTTP_MIDDLEWARE, fns, descriptor.value);
        return descriptor;
    };
}
exports.Middleware = Middleware;
