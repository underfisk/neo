"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const model_repository_1 = require("./model-repository");
const util_1 = require("util");
const metadata_scanner_1 = require("./metadata-scanner");
const constants_1 = require("../constants");
const constants_2 = require("../constants");
/**
 * Private instance of packate factory debug
 */
const log = debug('neots:repository-factory');
/**
 * Repository Factory is designed to process, analyze and load
 * our application resources such as Controllers, Listeners
 * and Models
 *
 * @author Enigma
 * @package Neo
 */
class RepositoryFactory {
    /**
     * Processes a given package
     *
     * @param pkg
     *
     * @return returns whether he was
     * loaded succesfully or throw error
     */
    static load(config, repoRef, router, io) {
        //First of all load our models/providers
        if (config.models !== undefined && config.models.length > 0) {
            let db = util_1.isUndefined(config.database) ? (!util_1.isUndefined(config.unsafeDatabase) ?
                config.unsafeDatabase : null) : config.database;
            this.loadModels(config.models, db, repoRef);
        }
        //Create a space for our models
        const modelRepository = new model_repository_1.ModelRepository(repoRef.getLoadedModels());
        //Load our express controllers
        if (config.controllers !== undefined && config.controllers.length > 0) {
            this.loadControllers(router, config.controllers, modelRepository, repoRef);
        }
        //Load our event listeners
        if (config.listeners !== undefined && config.listeners.length > 0) {
            this.loadListeners(config.listeners, modelRepository, repoRef, io);
        }
        //Output the loading result
        log(`${repoRef.getControllersCount()} controllers loaded.`);
        log(`${repoRef.getListenersCount()} listeneres loaded.`);
        log(`${repoRef.getModelsCount()} models loaded.`);
    }
    /**
     * Loads the controllers of a given package
     * @param pkg
     */
    static loadControllers(router, controllers, models, repo) {
        controllers.map((ctr) => {
            //Read the metadata of this controller
            const reflectionMethods = metadata_scanner_1.MetadataScanner.scan(ctr.prototype, constants_1.HTTP_ROUTE), reflectionClassData = metadata_scanner_1.MetadataScanner.scanClass(ctr, constants_1.HTTP_CONTROLLER);
            //Is it a listener?
            if (reflectionClassData === undefined)
                throw new Error(`${ctr.prototype.constructor.name} is an invalid controller, missing Controller decorator.`);
            let ctrInstance = null;
            //Do we have models?
            if (models.count() > 0 && reflectionClassData.modelsInjection)
                ctrInstance = new ctr(models);
            else
                ctrInstance = new ctr();
            //load it
            repo.loadController(ctrInstance);
            //Get the controller prefix
            const controllerPrefix = reflectionClassData.prefix;
            //Add get routes for the array
            if (reflectionMethods.length > 0) {
                //Loop through the reflector object
                reflectionMethods.map(reflector => {
                    let middlewares = Reflect.getMetadata(constants_1.HTTP_MIDDLEWARE, reflector.method), routeData = reflector.descriptor;
                    //Guarantee we have valid paths
                    if (routeData.path === '')
                        throw new Error(`${reflector.descriptor.path} is an invalid route`);
                    else if (controllerPrefix === '')
                        throw new Error(`${ctrInstance.constructor.name} has an invalid controller prefix`);
                    //Proceed the format of the route
                    reflector.descriptor.path = this.routeFormatter(controllerPrefix, reflector.descriptor.path);
                    this.loadRoutes(router, routeData, middlewares, ctrInstance, reflector.method.name);
                });
            }
        });
    }
    /**
     * Loads the models of a given package
     *
     * @private
     * @param {Package} pkg
     * @memberof PackageFactory
     */
    static loadModels(models, db, repo) {
        models.map((model) => {
            const metadata = Reflect.getMetadata(constants_2.NEO_MVC_MODEL, model);
            //Do we have metadata
            if (metadata !== undefined) {
                let ref = db == null ? new model() : new model(db);
                //Load it to our repository
                repo.loadModel({
                    reference: ref,
                    options: metadata
                });
            }
            else
                throw new Error('Invalid model provided without metadata:' + model.prototype.constructor.name);
        });
    }
    /**
     * Loads all the routes for express
     * @param pkg
     */
    static loadRoutes(appRouter, route, middlewares, controller, functionName) {
        if (middlewares !== undefined) {
            route.methods.map(method => {
                appRouter[method](route.path, middlewares, (req, res) => controller[functionName](req, res));
            });
        }
        else {
            route.methods.map(method => {
                appRouter[method](route.path, (req, res) => controller[functionName](req, res));
            });
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
    static loadListeners(listeners, models, repo, io) {
        listeners.map((eventListener) => {
            //Read the metadata of this event listeners first
            const reflectionMethodsData = metadata_scanner_1.MetadataScanner.scan(eventListener.prototype, constants_1.IO_HANDLER), reflectionClassData = metadata_scanner_1.MetadataScanner.scanClass(eventListener, constants_1.IO_LISTENER), nsMiddleware = Reflect.getMetadata(constants_1.NAMESPACE_IOMIDDLEWARE, eventListener);
            //Is it a listener?
            if (reflectionClassData === undefined)
                throw new Error(`${eventListener.prototype.constructor.name} is an invalid listener, missing EventListener decorator.`);
            //Used in order to keep a true alive reference to the instance
            let created_listener = null;
            //Now create their instances
            if (models.count() > 0)
                created_listener = new eventListener(io, models);
            else
                created_listener = new eventListener(io);
            //load it
            repo.loadListener(created_listener);
            //Before subscribe register namespace middlewares
            if (!util_1.isUndefined(nsMiddleware)) {
                //Set middleware for the provided namespace
                if (nsMiddleware.namespace === '/')
                    io.use(nsMiddleware.handler);
                else
                    io.of(nsMiddleware.namespace).use(nsMiddleware.handler);
            }
            //Do we have any subsribed event?
            if (reflectionMethodsData.length > 0) {
                if (reflectionClassData === null) {
                    //Bind to the connection establish event
                    io.on('connection', socket => {
                        //Loop it and bind them
                        reflectionMethodsData.map(reflector => {
                            const fnMiddleware = Reflect.getMetadata(constants_1.IO_EVENT_MIDDLEWARE, created_listener[reflector.method.name]);
                            //Do we have event specific middlewares?
                            if (fnMiddleware !== undefined)
                                socket.use((packet, next) => {
                                    if (packet[0] === reflector.descriptor)
                                        fnMiddleware(socket, packet, next);
                                    else
                                        next();
                                });
                            //Start creating the binds
                            socket.on(reflector.descriptor, req => {
                                created_listener[reflector.method.name](socket, req);
                            });
                        });
                    });
                }
                else {
                    //It is on a namespace
                    io.of(reflectionClassData).on('connection', socket => {
                        reflectionMethodsData.map(reflector => {
                            socket.on(reflector.descriptor, req => {
                                created_listener[reflector.method.name](socket, req);
                            });
                        });
                    });
                }
            }
        });
    }
    /**
     * Receives the prefix of controller and the path of the route
     * and escapes/explore it
     *
     * @param route
     */
    static routeFormatter(prefix, path) {
        let newRoute = "";
        //Is it not default controller nor default route
        if (path !== '/' && prefix !== '/') {
            newRoute = `/${prefix}/${path}`;
        }
        else if (path === '/' && prefix !== '/') //Is it not default controller and default route?
         {
            newRoute = `/${prefix}`;
        }
        else {
            if (path !== '/') //We dont want default route to be //
                newRoute = `/${path}`; //means its default controller and a normal route
        }
        //Clean the route from last character slash and return it
        return newRoute[newRoute.length - 1] === '/' ? newRoute.slice(0, newRoute.length - 1) : newRoute;
    }
}
exports.RepositoryFactory = RepositoryFactory;
