import { INeoModel } from "./interfaces/neo";
/**
 * ModelRepository is sent as dependecy injection
 * through contollers/listeners constructors
 *
 * @package Neo
 * @author Enigma
 */
export declare class ModelRepository {
    private readonly models;
    /**
     * Injection of models
     */
    constructor(models: INeoModel[]);
    /**
     * Returns the model instance if found by it's name or alias if defined
     * @param name
     */
    get<T>(nameOrAlias: string): T;
    /**
     * Returns whether the model exists or not
     * @param nameOrAlias
     */
    exists(nameOrAlias: string): boolean;
    /**
     * Returns the count of models loaded
     */
    count(): number;
}
