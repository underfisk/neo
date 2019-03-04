import { INeoModel } from './interfaces/neo';
import { Constructable } from '../common/constructable';
/**
 * Returns a repository of a loaded package
 * where the contained package data is returned
 * @todo Refactor this!
 */
export declare class Repository {
    private readonly controllers?;
    private models;
    private readonly listeners?;
    /**
     * Tries to load the given model
     * In case it's already loaded it returns it's instance
     *
     * @todo Also check if is loaded in imported packages
     */
    loadModel<T>(model: INeoModel): T | undefined;
    /**
     * Loads a controller
     *
     * @param controller
     */
    loadController(controller: Constructable<any>): any;
    /**
     * Load a listener
     *
     * @param listener
     */
    loadListener(listener: Constructable<any>): any;
    /**
     * Returns the model if is loaded otherwise returns undefined
     * @param name
     */
    getModel<T = any>(nameOrAlias: string): T;
    /**
     * Returns the list of loaded models
     */
    getLoadedModels(): INeoModel[];
    getModelsCount(): number;
    getListenersCount(): number;
    getControllersCount(): number;
}
