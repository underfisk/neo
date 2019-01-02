import { IModelOptions } from "../../common/decorators/interfaces";

/**
 * Provides an interface to link reference->options to our models
 * @package Neo.core
 */
export interface INeoModel
{
    reference: any,
    options: IModelOptions
}