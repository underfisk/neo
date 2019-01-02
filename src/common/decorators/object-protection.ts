/**
 * Sealed is a decorator to prevent object modification
 * 
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal
 * @param constructor 
 */
export function sealed(constructor: Function) : any {
    Object.seal(constructor)
    Object.seal(constructor.prototype)
}

/**
 * Freezed is a decorator to prevent the object modification
 * 
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 * @param constructor
 */
export function freezed(constructor: Function) : any {
    Object.freeze(constructor)
    Object.freeze(constructor.prototype)
}