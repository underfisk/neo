import * as debug from 'debug'
import { INeoModel, IServiceData } from '../interfaces/neo';
import { IPackage } from '../interfaces/package';
import {Constructable} from '../../common/constructable'
import { Handler } from 'express'

const log: any = debug('neots:repository')

/**
 * Returns a repository of a loaded package
 * where the contained package data is returned
 * @todo Refactor this!
 */
export class Repository
{
    private readonly name: string 
    private readonly controllers?: Constructable<any>[]
    private models: INeoModel[]
    private readonly middlewares?: Handler[]
    private readonly listeners?: Constructable<any>[]

    /**
     * Receives a package default or not
     * @param pkg 
     */
    constructor(pkg: IPackage){
        log('Package repository is being created..')
        this.name = pkg.name
        this.controllers = pkg.controllers
        this.listeners = pkg.listeners
        this.models = this.transformModels(pkg.models),
        this.middlewares = pkg.middlewares
    }
    
    /**
     * Transforms a model to a neo model
     */
    private transformModels(models: any[]) : INeoModel[] {
        let transformedList = []
        for(const model of models)
            transformedList.push({
                reference: model.reference,
                options: model.options
            })

        return transformedList
    }

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
                    return e
        }
        else {
            this.listeners.push(listener)  
            return listener
        }
    }


    /**
     * Returns this package name
     */
    public getName() : string {
        return this.name
    }

    /**
     * Returns the model if is loaded otherwise returns undefined
     * @param name 
     */
    public getModel<T>(nameOrAlias: string) : any {
        for(const loadedModel of this.models)
            if (loadedModel.options.alias === nameOrAlias) 
                return loadedModel.reference as T
    }


    /**
     * Returns the list of loaded models 
     */
    public getLoadedModels() : any[] {
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