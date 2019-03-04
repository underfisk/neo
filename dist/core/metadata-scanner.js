"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
/**
 * MetadaScanner is a reflection utility to gather information of node modules/function parsed
 * given to be loaded
 *
 * @author Enigma
 * @package Neo
 */
class MetadataScanner {
    /**
     * Scans for metadata with the given property
     * @param obj
     * @param property
     */
    static scan(obj, property) {
        let methods = [];
        Object.getOwnPropertyNames(obj).forEach((name) => {
            if (typeof obj[name] === 'function' && name !== 'constructor') {
                let methodDescriptor = Reflect.getMetadata(property, obj[name]);
                //Is the reference not undefined? save it
                if (methodDescriptor !== undefined)
                    methods.push({
                        descriptor: methodDescriptor,
                        method: obj[name]
                    });
            }
        });
        return methods;
    }
    /**
     * Returns the class metadata if it founds
     * @param obj
     * @param property
     */
    static scanClass(obj, property) {
        return Reflect.getMetadata(property, obj);
    }
}
exports.MetadataScanner = MetadataScanner;
