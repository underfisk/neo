import * as debug from 'debug'
import { INeoModel } from './interfaces/neo';
import {Constructable} from '../common/constructable'
import { Logger } from '../common';


/**
 * Returns a repository of a loaded package
 * where the contained package data is returned
 * @todo Refactor this!
 */
export class Repository
{
    private readonly controllers?: Constructable<any>[] = []
    private models: INeoModel[] = []
    private readonly listeners?: Constructable<any>[] = []



    /**
     * Tries to load the given model
     * In case it's already loaded it returns it's instance
     * 
     * @todo Also check if is loaded in imported packages
     */
    public loadModel<T>(model: INeoModel) : T|undefined {
        if (this.models.map( e => e.options.alias).indexOf(model.options.alias) !== -1) {
            //we are sure that it already exists so    
            for(const e of this.models)
                if (e.options.alias === model.options.alias)
                    return e.reference as T
        }
        else {
            //Add it cuz it wasn't added yet
            this.models.push(model)
            return model.reference as T
        }
    }

    /**
     * Loads a controller
     * 
     * @param controller 
     */
    public loadController(controller: Constructable<any>) : any {
        if (this.controllers.map( e => e.constructor.name).indexOf(controller.constructor.name) !== -1) {
            for(const e of this.controllers)
                if (e.constructor.name === controller.constructor.name)
                    return e
        }
        else {
            this.controllers.push(controller)  
            return controller
        }
    }

    /**
     * Load a listener
     * 
     * @param listener 
     */
    public loadListener(listener: Constructable<any>) : any {
        if (this.listeners.map( e => e.constructor.name).indexOf(listener.constructor.name) !== -1){
            for(const e of this.listeners)
                if (e.constructor.name === listener.constructor.name)
                    return
        }
        else {
            this.listeners.push(listener) 
        }
    }

    /**
     * Returns the model if is loaded otherwise returns undefined
     * @param name 
     */
    public getModel<T = any>(nameOrAlias: string) : T {
        for(const loadedModel of this.models)
            if (loadedModel.options.alias === nameOrAlias) 
                return loadedModel.reference as T
    }


    /**
     * Returns the list of loaded models 
     */
    public getLoadedModels() : INeoModel[] {
        return this.models
    }

    public getModelsCount() : number {
        return this.models.length
    }

    public getListenersCount() : number {
        return this.listeners.length
    }

    public getControllersCount() : number {
        return this.controllers.length
    }
}