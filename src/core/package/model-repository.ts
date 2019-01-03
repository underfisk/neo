import { INeoModel } from "../interfaces/neo-model";

/**
 * ModelRepository is sent as dependecy injection
 * through contollers/listeners constructors
 * 
 * @package Neo
 * @author Enigma
 */
export class ModelRepository
{
    /**
     * Injection of models
     */
    constructor(private readonly models: INeoModel[]){}
    
    /**
     * Returns the model instance if found by it's name or alias if defined
     * @param name 
     */
    public get<T>(nameOrAlias: string) : T {
        for(const e of this.models)
            if (e.options.alias === nameOrAlias) return e.reference as T
        return undefined
    }

    /**
     * Returns whether the model exists or not
     * @param nameOrAlias 
     */
    public exists(nameOrAlias: string) : boolean {
        return (this.models.map( e => e.options.alias).indexOf(nameOrAlias) !== -1)
    }

    /**
     * Returns the count of models loaded
     */
    public count() : number {
        return this.models.length
    }
}