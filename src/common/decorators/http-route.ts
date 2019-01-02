import { HttpMethod } from "../enums";
import { isUndefined } from 'util';
import { HTTP_ROUTE } from '../../constants';
import { IRouteMetadata } from '../../core/interfaces/metadata/routes-metadata';

/**
 * Creates a route mapping object
 * @param path 
 * @param method 
 */
const createMapping = (method: HttpMethod) => (path?: string) : MethodDecorator => {
    return (target: object, key, descriptor) => {
        //Do we have already methods on this fn?
        if (Reflect.hasMetadata(HTTP_ROUTE, descriptor.value))
        {
            const previous: IRouteMetadata = Reflect.getMetadata(HTTP_ROUTE, descriptor.value)
            const newMethods: string[] = previous.methods.slice()
            newMethods.push(method)
            Reflect.defineMetadata(HTTP_ROUTE, {
                path: path || '/',
                methods: newMethods
            }, descriptor.value)
        }
        else
        {
            Reflect.defineMetadata(HTTP_ROUTE, {
                path: isUndefined(path) ? '/' : path,
                methods: [ method || 'get' ]
            }, descriptor.value)
        }
        return descriptor
    }
}


/**
 * Get is a decoreator to define HTTP GET Method to handle a specific path route
 */
export const Get = createMapping(HttpMethod.GET)

/**
 * Post is a decorator to define HTTP POST Method to handle a specific path route
 */
export const Post = createMapping(HttpMethod.POST)
/**
 * Put is a decorator to define HTTP PUT Method to handle a specific path route
 */
export const Put = createMapping(HttpMethod.PUT)
/**
 * All is a decorator to define HTTP All Methods to handle a specific path route
 */
export const All = createMapping(HttpMethod.ALL)
/**
 * Delete is a decorator to define HTTP Delete Method to handle a specific path route
 */
export const Delete = createMapping(HttpMethod.DELETE)
/**
 * Options is a decorator to define HTTP OPTIONS Method to handle a specific path route
 */
export const Options = createMapping(HttpMethod.OPTIONS)
/**
 * Head is a decorator to define HTTP HEAD Method to handle a specific path route
 */
export const Head = createMapping(HttpMethod.HEAD)
/**
 * Patch is a decorator to define HTTP PATCH Method to handle a specific path route
 */
export const Patch = createMapping(HttpMethod.PATCH)