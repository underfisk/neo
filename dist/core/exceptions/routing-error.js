"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Throws a RoutingError error
 *
 * @package Neo
 */
class RoutingError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = "Routing Error";
        this.stack = new Error().stack;
    }
}
exports.RoutingError = RoutingError;
