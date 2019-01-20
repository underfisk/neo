import { isUndefined } from 'util';
import { HTTP_CONTROLLER } from '../../constants';
import 'reflect-metadata'
/**
 * Controller is the decorator to specify that the class above is
 * going to have routes and handle http requests
 * @param data 
 */
export function Controller (data?: IControllerData) : ClassDecorator {
    const newData: IControllerData = {
        prefix: !isUndefined(data) && !isUndefined(data.prefix) ? data.prefix : '/',
        modelsInjection: !isUndefined(data) && !isUndefined(data.modelsInjection) ? data.modelsInjection : true
    }
    return (target: object) => {
        Reflect.defineMetadata(HTTP_CONTROLLER, newData, target)
    }
}

/**
 * Configuration data for controller decorator
 *
 */
export interface IControllerData {
    /**
     * URL prefix
     * 
     * @default /
     */
    prefix?: string,
    /**
     * Define whether you want to receives a Models Container
     * 
     * @default true
     */
    modelsInjection?: boolean
}