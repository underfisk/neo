"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
require("reflect-metadata");
/**
 * EventMiddleware is mentioned for socket.io handlers and it's called
 * before the socket event being fired and when the data packet arrives
 *
 * @package Neo
 */
function EventMiddleware(fn) {
    return (target, key, descriptor) => {
        Reflect.defineMetadata(constants_1.IO_EVENT_MIDDLEWARE, fn, descriptor.value);
        return descriptor;
    };
}
exports.EventMiddleware = EventMiddleware;
/**
 * Registers a new middleware to be used in the namespace
 *
 */
function NamespaceMiddleware(namespace = '/', fn) {
    return (target) => {
        Reflect.defineMetadata(constants_1.NAMESPACE_IOMIDDLEWARE, {
            namespace: namespace,
            handler: fn
        }, target);
    };
}
exports.NamespaceMiddleware = NamespaceMiddleware;
