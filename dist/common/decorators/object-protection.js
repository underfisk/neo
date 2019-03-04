"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sealed is a decorator to prevent object modification
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal
 * @param constructor
 */
function sealed(constructor) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}
exports.sealed = sealed;
/**
 * Freezed is a decorator to prevent the object modification
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 * @param constructor
 */
function freezed(constructor) {
    Object.freeze(constructor);
    Object.freeze(constructor.prototype);
}
exports.freezed = freezed;
