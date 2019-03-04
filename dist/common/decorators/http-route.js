"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
const util_1 = require("util");
const constants_1 = require("../../constants");
require("reflect-metadata");
/**
 * Creates a route mapping object
 * @param path
 * @param method
 */
const createMapping = (method) => (path) => {
    return (target, key, descriptor) => {
        //Do we have already methods on this fn?
        if (Reflect.hasMetadata(constants_1.HTTP_ROUTE, descriptor.value)) {
            const previous = Reflect.getMetadata(constants_1.HTTP_ROUTE, descriptor.value);
            const newMethods = previous.methods.slice();
            newMethods.push(method);
            Reflect.defineMetadata(constants_1.HTTP_ROUTE, {
                path: path || '/',
                methods: newMethods
            }, descriptor.value);
        }
        else {
            Reflect.defineMetadata(constants_1.HTTP_ROUTE, {
                path: util_1.isUndefined(path) ? '/' : path,
                methods: [method || 'get']
            }, descriptor.value);
        }
        return descriptor;
    };
};
/**
 * Get is a decoreator to define HTTP GET Method to handle a specific path route
 */
exports.Get = createMapping(enums_1.HttpMethod.GET);
/**
 * Post is a decorator to define HTTP POST Method to handle a specific path route
 */
exports.Post = createMapping(enums_1.HttpMethod.POST);
/**
 * Put is a decorator to define HTTP PUT Method to handle a specific path route
 */
exports.Put = createMapping(enums_1.HttpMethod.PUT);
/**
 * All is a decorator to define HTTP All Methods to handle a specific path route
 */
exports.All = createMapping(enums_1.HttpMethod.ALL);
/**
 * Delete is a decorator to define HTTP Delete Method to handle a specific path route
 */
exports.Delete = createMapping(enums_1.HttpMethod.DELETE);
/**
 * Options is a decorator to define HTTP OPTIONS Method to handle a specific path route
 */
exports.Options = createMapping(enums_1.HttpMethod.OPTIONS);
/**
 * Head is a decorator to define HTTP HEAD Method to handle a specific path route
 */
exports.Head = createMapping(enums_1.HttpMethod.HEAD);
/**
 * Patch is a decorator to define HTTP PATCH Method to handle a specific path route
 */
exports.Patch = createMapping(enums_1.HttpMethod.PATCH);
