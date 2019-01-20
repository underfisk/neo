import { Router } from 'express';
import * as debug from 'debug'
import {PackageRepository} from './package-repository';
import { Repository } from './repository';
import { ModelRepository } from './model-repository';
import { isUndefined } from 'util';
import { MetadataScanner } from '../metadata-scanner';
import { Constructable } from '../../common/constructable';
import { IControllerData } from '../../common/decorators/http-controller';
import { 
    HTTP_MIDDLEWARE, 
    HTTP_ROUTE, 
    HTTP_CONTROLLER, 
    IO_HANDLER, 
    IO_LISTENER, 
    IO_EVENT_MIDDLEWARE, 
    NAMESPACE_IOMIDDLEWARE, 
    NEO_SERVICE
} from '../../constants';
import { IRouteMetadata } from '../interfaces/routes-metadata';
import { NEO_MVC_MODEL } from '../../constants';
import { IPackage } from '../interfaces/package';
import { IServiceData } from '../interfaces';

/**
 * Private instance of packate factory debug
 */
const log = debug('neots:package-factory')


/**
 * Package Factory is designed to process, analyze and load packages and it's content
 * 
 * @author Enigma
 * @package Neo
 */
export class PackageFactory
{
    private repo: Repository

    /**
     * Dictionary of loadedPackages is manditory here
     * 
     * @param loadedPackages 
     */
    constructor(private readonly router: Router, 
            private readonly io: SocketIO.Server,
            private readonly db?: any){}
    
    /**
     * Processes a given package
     * 
     * @param pkg 
     * 
     * @return returns whether he was 
     * loaded succesfully or throw error
     */
    public process(pkg: IPackage) : any {
        log(`Processing package: ${pkg.name}`)

        //Name is unique so 
        if ( this.isAlreadyLoaded(pkg.name) )
            throw new Error(`${pkg.name} is already loaded.`)
        else
            this.repo = PackageRepository.createPackage(pkg.name)

        //Analyze if the resources inside the package are not loaded
        this.analyze(pkg)
    }
    
    /**
     * Analyzes a package and verify circular dependecy problems
     * 
     * @param pkg 
     */
    private analyze(pkg: IPackage) : void {

        if (typeof pkg.models != 'undefined' && pkg.models.length > 0)
            this.loadModels(pkg.models)
            
        //Now create a new repository of models
        const modelsRepository = new ModelRepository(this.repo.getLoadedModels())

        if (typeof pkg.controllers != 'undefined' && pkg.controllers.length > 0)
            this.loadControllers(pkg.controllers, modelsRepository)

        if (typeof pkg.listeners != 'undefined' && pkg.listeners.length > 0)
            this.loadListeners(pkg.listeners, modelsRepository)

        log(`${this.repo.getControllersCount()} controllers loaded.`)
        log(`${this.repo.getListenersCount()} listeneres loaded.`)
        log(`${this.repo.getModelsCount()} models loaded.`)
    }

    /**
     * Loads the controllers of a given package
     * @param pkg 
     */
    private loadControllers(controllers: Constructable<any>[], models: ModelRepository) : void
    {
        controllers.map( (ctr : Constructable<any>) => {
            //Read the metadata of this controller
            const reflectionMethods = MetadataScanner.scan<any, string>(ctr.prototype, HTTP_ROUTE),
                reflectionClassData = MetadataScanner.scanClass<IControllerData>(ctr, HTTP_CONTROLLER)

            //Is it a listener?
            if (reflectionClassData === undefined)
                throw new Error(`${ctr.prototype.constructor.name} is an invalid controller, missing Controller decorator.`)

            let ctrInstance = null

            //Do we have models?
            if (models.count() > 0 && reflectionClassData.modelsInjection)
                ctrInstance = new ctr(models)
            else
                ctrInstance = new ctr()


            //load it
            this.repo.loadController(ctrInstance)

            //Get the controller prefix
            const controllerPrefix = reflectionClassData.prefix
            //Add get routes for the array
            if (reflectionMethods.length > 0)
            {   
                //Loop through the reflector object
                reflectionMethods.map( reflector => {
                    let middlewares: Function = Reflect.getMetadata(HTTP_MIDDLEWARE, reflector.method),
                        routeData: IRouteMetadata = reflector.descriptor
                    
                    //Guarantee we have valid paths
                    if (routeData.path === '')
                        throw new Error(`${reflector.descriptor.path} is an invalid route`)
                    else if (controllerPrefix === '')
                        throw new Error(`${ctrInstance.constructor.name} has an invalid controller prefix`)

                    //Proceed the format of the route
                    reflector.descriptor.path = this.routeFormatter(controllerPrefix, reflector.descriptor.path)
                        
                    this.loadRoutes(routeData, middlewares, ctrInstance, reflector.method.name)
                })
            }
        })
    }

    /**
     * Loads the models of a given package
     *
     * @private
     * @param {Package} pkg
     * @memberof PackageFactory
     */
    private loadModels(models: any[]) : void
    {
        models.map ( (model : Constructable<any>) => {
            const metadata = Reflect.getMetadata(NEO_MVC_MODEL, model)
            //Do we have metadata
            if (metadata !== undefined)
            {
                let ref = this.db == null ? new model() : new model(this.db)
                //Load it to our repository
                this.repo.loadModel({
                    reference: ref,
                    options: metadata
                })
            }
            else
                throw new Error('Invalid model provided without metadata:' + model.prototype.constructor.name)
        })
    }

    /**
     * Loads all the routes for express
     * @param pkg 
     */
    private loadRoutes(route: IRouteMetadata, middlewares: Function, controller: any, functionName: string) : void {
        if (middlewares !== undefined) {
            route.methods.map( method => {
                this.router[method](route.path, middlewares, (req,res) => controller[functionName](req,res))
            })
        }
        else {
            route.methods.map( method => {
               this.router[method](route.path, (req,res) => controller[functionName](req,res))
            })
        }
    }

    /**
     * Load all the listeners
     *
     * @private
     * @param {Package} pkg
     * @returns {Listener[]}
     * @memberof PackageFactory
     */
    private loadListeners(listeners: Constructable<any>[], models: ModelRepository) : void {
        listeners.map( (eventListener: Constructable<any>) => {
            //Read the metadata of this event listeners first
            const reflectionMethodsData = MetadataScanner.scan<any, string>(eventListener.prototype, IO_HANDLER),
                reflectionClassData = MetadataScanner.scanClass<any>(eventListener, IO_LISTENER),
                nsMiddleware = Reflect.getMetadata(NAMESPACE_IOMIDDLEWARE, eventListener)

            //Is it a listener?
            if (reflectionClassData === undefined)
                throw new Error(`${eventListener.prototype.constructor.name} is an invalid listener, missing EventListener decorator.`)

            //Used in order to keep a true alive reference to the instance
            let created_listener = null

            //Now create their instances
            if (models.count() > 0)
                created_listener = new eventListener(this.io, models)
            else
                created_listener = new eventListener(this.io)    

            //load it
            this.repo.loadListener(created_listener)

            //Before subscribe register namespace middlewares
            if (!isUndefined(nsMiddleware))
            {
                //Set middleware for the provided namespace
                if (nsMiddleware.namespace === '/')
                    this.io.use(nsMiddleware.handler)
                else
                    this.io.of(nsMiddleware.namespace).use(nsMiddleware.handler)
            }

            //Do we have any subsribed event?
            if (reflectionMethodsData.length > 0)
            {
                if ( reflectionClassData == "")
                {
                    //Bind to the connection establish event
                    this.io.on('connection', socket => {
                        //Loop it and bind them
                        reflectionMethodsData.map( reflector => {
                            const fnMiddleware = Reflect.getMetadata(IO_EVENT_MIDDLEWARE, created_listener[reflector.method.name])
                            //Do we have event specific middlewares?
                            if (fnMiddleware !== undefined)
                                socket.use( (packet, next) => {
                                    if (packet[0] === reflector.descriptor)
                                        fnMiddleware(socket, packet, next)
                                    else
                                        next()
                                }) 
                
                            //Start creating the binds
                            socket.on(reflector.descriptor, req => {
                                created_listener[reflector.method.name](socket, req)
                            })
                        })
                    })
                }
                else
                {
                    //It is on a namespace
                    this.io.of(reflectionClassData).on('connection', socket => {
                        reflectionMethodsData.map( reflector => {
                            socket.on(reflector.descriptor, req => {
                                created_listener[reflector.method.name](socket,req)
                            })
                        })
                    })
                }
            }
        })
    }


    /**
     * Receives the prefix of controller and the path of the route
     * and escapes/explore it
     * 
     * @param route 
     */
    private routeFormatter(prefix: string, path: string ) : string {
        let newRoute: string = ""

        //Is it not default controller nor default route
        if (path !== '/' && prefix !== '/')
        {
            newRoute = `/${prefix}/${path}`
        }
        else if (path === '/' && prefix !== '/') //Is it not default controller and default route?
        {
            newRoute = `/${prefix}`
        }
        else
        {
            if (path !== '/') //We dont want default route to be //
                newRoute = `/${path}` //means its default controller and a normal route
        }

        //Clean the route from last character slash and return it
        return newRoute[newRoute.length - 1] === '/' ? newRoute.slice(0, newRoute.length - 1) : newRoute
    }

    /**
     * Verifies if a package is loaded
     * 
     * @param name
     * 
     * @return Whether a package is loaded or not 
     */
    private isAlreadyLoaded(name: string) : boolean {
        return PackageRepository.isLoaded(name)
    }
}