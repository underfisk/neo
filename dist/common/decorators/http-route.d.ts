import 'reflect-metadata';
/**
 * Get is a decoreator to define HTTP GET Method to handle a specific path route
 */
export declare const Get: (path?: string) => MethodDecorator;
/**
 * Post is a decorator to define HTTP POST Method to handle a specific path route
 */
export declare const Post: (path?: string) => MethodDecorator;
/**
 * Put is a decorator to define HTTP PUT Method to handle a specific path route
 */
export declare const Put: (path?: string) => MethodDecorator;
/**
 * All is a decorator to define HTTP All Methods to handle a specific path route
 */
export declare const All: (path?: string) => MethodDecorator;
/**
 * Delete is a decorator to define HTTP Delete Method to handle a specific path route
 */
export declare const Delete: (path?: string) => MethodDecorator;
/**
 * Options is a decorator to define HTTP OPTIONS Method to handle a specific path route
 */
export declare const Options: (path?: string) => MethodDecorator;
/**
 * Head is a decorator to define HTTP HEAD Method to handle a specific path route
 */
export declare const Head: (path?: string) => MethodDecorator;
/**
 * Patch is a decorator to define HTTP PATCH Method to handle a specific path route
 */
export declare const Patch: (path?: string) => MethodDecorator;
