"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns a repository of a loaded package
 * where the contained package data is returned
 * @todo Refactor this!
 */
class Repository {
    constructor() {
        this.controllers = [];
        this.models = [];
        this.listeners = [];
    }
    /**
     * Tries to load the given model
     * In case it's already loaded it returns it's instance
     *
     * @todo Also check if is loaded in imported packages
     */
    loadModel(model) {
        if (this.models.map(e => e.options.alias).indexOf(model.options.alias) !== -1) {
            //we are sure that it already exists so    
            for (const e of this.models)
                if (e.options.alias === model.options.alias)
                    return e.reference;
        }
        else {
            //Add it cuz it wasn't added yet
            this.models.push(model);
            return model.reference;
        }
    }
    /**
     * Loads a controller
     *
     * @param controller
     */
    loadController(controller) {
        if (this.controllers.map(e => e.constructor.name).indexOf(controller.constructor.name) !== -1) {
            for (const e of this.controllers)
                if (e.constructor.name === controller.constructor.name)
                    return e;
        }
        else {
            this.controllers.push(controller);
            return controller;
        }
    }
    /**
     * Load a listener
     *
     * @param listener
     */
    loadListener(listener) {
        if (this.listeners.map(e => e.constructor.name).indexOf(listener.constructor.name) !== -1) {
            for (const e of this.listeners)
                if (e.constructor.name === listener.constructor.name)
                    return;
        }
        else {
            this.listeners.push(listener);
        }
    }
    /**
     * Returns the model if is loaded otherwise returns undefined
     * @param name
     */
    getModel(nameOrAlias) {
        for (const loadedModel of this.models)
            if (loadedModel.options.alias === nameOrAlias)
                return loadedModel.reference;
    }
    /**
     * Returns the list of loaded models
     */
    getLoadedModels() {
        return this.models;
    }
    getModelsCount() {
        return this.models.length;
    }
    getListenersCount() {
        return this.listeners.length;
    }
    getControllersCount() {
        return this.controllers.length;
    }
}
exports.Repository = Repository;
