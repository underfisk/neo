"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ModelRepository is sent as dependecy injection
 * through contollers/listeners constructors
 *
 * @package Neo
 * @author Enigma
 */
class ModelRepository {
    /**
     * Injection of models
     */
    constructor(models) {
        this.models = models;
    }
    /**
     * Returns the model instance if found by it's name or alias if defined
     * @param name
     */
    get(nameOrAlias) {
        for (const e of this.models)
            if (e.options.alias === nameOrAlias)
                return e.reference;
        return undefined;
    }
    /**
     * Returns whether the model exists or not
     * @param nameOrAlias
     */
    exists(nameOrAlias) {
        return (this.models.map(e => e.options.alias).indexOf(nameOrAlias) !== -1);
    }
    /**
     * Returns the count of models loaded
     */
    count() {
        return this.models.length;
    }
}
exports.ModelRepository = ModelRepository;
