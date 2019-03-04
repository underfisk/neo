import 'reflect-metadata';
/**
 * MetadaScanner is a reflection utility to gather information of node modules/function parsed
 * given to be loaded
 *
 * @author Enigma
 * @package Neo
 */
export declare class MetadataScanner {
    /**
     * Scans for metadata with the given property
     * @param obj
     * @param property
     */
    static scan<T, Y>(obj: T, property: string): any;
    /**
     * Returns the class metadata if it founds
     * @param obj
     * @param property
     */
    static scanClass<T>(obj: any, property: string): T;
}
