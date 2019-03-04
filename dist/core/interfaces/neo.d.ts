import { IModelOptions } from "../../common/decorators/interfaces";
/**
 * Provides an interface to link reference->options to our models
 * @package Neo.core
 */
export interface INeoModel {
    reference: any;
    options: IModelOptions;
}
/**
 * Provides essencial data for our service
 * work in the same way without having unexpected results
 * @package Neo.core
 */
export interface IServiceData {
    /**
     * This is required due to be a unique alias.
     * Warning: Do not duplicate names!
     * @required
     */
    name: string;
    /**
     * You can pass your service instance here
     * to be gathered in services space
     * @required
     */
    instance: any;
}
