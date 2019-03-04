"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
require("reflect-metadata");
/**
 * Injectable decorator allows your class to receive
 * throught "Depedency Injection" the autoloaded instances
 *
 * @example Models receive adapter
 * Controllers get models
 * Listeners get socket.io and models
 */
function Injectable() {
    return (target) => {
        Reflect.defineMetadata(constants_1.INJECTABLE_OBJECT, true, target);
    };
}
exports.Injectable = Injectable;
