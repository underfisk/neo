"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlstring_1 = require("sqlstring");
/**
 * Returns a bind mark separed wih commas
 * @param size
 */
function bindMarks(size) {
    let str = "";
    for (let i = 0; i < size; i++) {
        if (i === size - 1) //last
            str += '?';
        else
            str += '?,';
    }
    return str;
}
exports.bindMarks = bindMarks;
/**
 * Returns a transformed set string for sql update query (values come
 * escaped using sqlstring module)
 *
 * @param data
 */
function transformSet(data) {
    let transformed = '';
    data.map((obj, index) => {
        transformed += (`${obj.column} = ${sqlstring_1.escape(obj.value)}`);
        if (index !== data.length - 1)
            transformed += (',');
    });
    return transformed;
}
exports.transformSet = transformSet;
