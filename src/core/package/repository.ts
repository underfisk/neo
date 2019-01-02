import * as debug from 'debug'
import { Constructable } from '../../common/collections';
import { INeoModel } from '../interfaces/neo-model';
import { Package, TransformedPackage } from '../interfaces/package';
const log: any = debug('app:package-repository')

/**
 * Returns a repository of a loaded package
 * where the contained package data is returned
 */
export class Repository
{
    /**
     * Package instance
     */
    private package: TransformedPackage

    /**
     * Receives a package default or not
     * @param pkg 
     */
    constructor(pkg: Package){
        log('Package repository is being created..')
        this.package= {
            name: pkg.name,
            configs: pkg.configs,
            controllers: pkg.controllers,
            listeners: pkg.listeners,
            models: this.transformModels(pkg.models),
            middlewares: pkg.middlewares,
            imports: pkg.imports
        }
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
        if (this.package.models.map( e => e.options.alias).indexOf(model.options.alias) !== -1)
        {
            //we are sure that it already exists so    
            for(const e of this.package.models)
                if (e.options.alias === model.options.alias)
                    return e.reference as T
        }
        else
        {
            //Add it cuz it wasn't added yet
            this.package.models.push(model)
            return model.reference as T
        }
    }

    /**
     * Loads a controller
     * 
     * @param controller 
     */
    public loadController<T>(controller: Constructable<any>) : any {
        if (this.package.controllers.map( e => e.constructor.name).indexOf(controller.constructor.name) !== -1)
        {
            for(const e of this.package.controllers)
                if (e.constructor.name === controller.constructor.name)
                    return e
        }
        else
        {
            this.package.controllers.push(controller)  
            return controller
        }
    }

    /**
     * Load a listener
     * 
     * @param listener 
     */
    public loadListener<T>(listener: Constructable<any>) : any {
        if (this.package.listeners.map( e => e.constructor.name).indexOf(listener.constructor.name) !== -1)
        {
            for(const e of this.package.listeners)
                if (e.constructor.name === listener.constructor.name)
                    return e
        }
        else
        {
            this.package.listeners.push(listener)  
            return listener
        }
    }

    /**
     * Returns this package name
     */
    public getName() : string {
        return this.package.name
    }

    /**
     * Returns the model if is loaded otherwise returns undefined
     * @todo Make the cast available 
     * @param name 
     */
    public getModel<T>(nameOrAlias: string) : any {
        for(const loadedModel of this.package.models)
            if (loadedModel.options.alias === nameOrAlias) 
                return loadedModel.reference as T

        return undefined
    }

    /**
     * Returns the list of loaded models 
     */
    public getLoadedModels() : any[] {
        return this.package.models
    }

    /**
     * Returns the list of loaded controllers 
     */
    public getLoadedControllers() : Constructable<any>[] {
        return this.package.controllers
    }

    /**
     * Returns the list of loaded listeners
     */
    public getLoadedListeners() : Constructable<any>[] {
        return this.package.listeners
    }

}