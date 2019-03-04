import 'reflect-metadata';
/**
 * Controller is the decorator to specify that the class above is
 * going to have routes and handle http requests
 * @param data
 */
export declare function Controller(data?: IControllerData): ClassDecorator;
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
    prefix?: string;
    /**
     * Define whether you want to receives a Models Container
     *
     * @default true
     */
    modelsInjection?: boolean;
}
