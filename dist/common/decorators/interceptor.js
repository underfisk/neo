"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
require("reflect-metadata");
/**
 * Interceptor is a middleware object which is allowed
 * to modify the whole class after being instanciated
 *
 * ** Warning **: Use this very careful in cases like controllers
 *
 * @example `When our factory creates the `class` instance which
 * is decoratored, interceptor is called with the `class` object to modify
 * and has to `return` a new whole or the same`
 */
function Interceptor() {
    return (target) => {
        Reflect.defineMetadata(constants_1.INTERCEPTABLE, true, target);
    };
}
exports.Interceptor = Interceptor;
