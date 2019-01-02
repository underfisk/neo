/**
 * Provides a list of options of this model
 * to be consider at our package factory
 */
export interface IModelOptions
{
    /**
     * Whether this model want's to receive a ModelRepository
     * of the current package where is being loaded
     * @default false
     */
    modelsInjection?: boolean,
    /**
     * Whether this model is available for 
     * other packages outside the current one
     * @default true
     */
    isGlobal?: boolean,
    /**
     * Models may receive an alias name in order to provide
     * shorthand names
     * @default ClassName
     */
    alias?: string
}