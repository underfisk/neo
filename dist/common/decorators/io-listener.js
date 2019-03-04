"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const constants_1 = require("../../constants");
require("reflect-metadata");
/**
 * Defines the Event Listener for socket.io just as a namespace
 * @todo Make this receive a interface object in order to have multiple options
 * @param name
 */
function EventListener(data) {
    const nData = util_1.isUndefined(data) ? null : data;
    return (target) => {
        Reflect.defineMetadata(constants_1.IO_LISTENER, nData, target);
    };
}
exports.EventListener = EventListener;
/**
 * Defines a bind for an event after a connection being established
 */
function SubscribeEvent(eventName) {
    return (target, key, descriptor) => {
        Reflect.defineMetadata(constants_1.IO_HANDLER, eventName, descriptor.value);
        return descriptor;
    };
}
exports.SubscribeEvent = SubscribeEvent;
