import * as Express from 'express'
import * as http from 'http'
import * as https from 'https'
import * as debug from 'debug'
import * as io from 'socket.io'
import * as session from 'express-session'
import { RepositoryFactory } from './factory';
import { SessionOptions } from 'express-session';
import * as compression from 'compression'
import * as cors from 'cors'
import * as helmet from 'helmet'
import { isUndefined } from 'util';
import { NeoAppConfig } from './interfaces/app-config';
import { IoMiddleware } from './interfaces/io';
import { IServiceData, INeoModel } from './interfaces';
import { Repository } from './repository';


/**
 * Neo-Application is designed to be a single instance running
 * express and socket.io under it
 * Check the documentation for more information
 * 
 * @package Neo.ts
 * @link https://github.com/underfisk/neo
 * @author Enigma
 */
export class NeoApplication {
    /**
     * Express.Application instance
     */
    private readonly expressApp : Express.Application

    /**
     * Express.Router instance
     */
    private readonly expressRouter: Express.Router

    /**
     * Server is defined according to provided config option
     */
    private readonly server: http.Server | https.Server

    /**
     * SocketIO.Server instance
     */
    private readonly eventIO?: SocketIO.Server

    /**
     * Singleton of this application
     */
    private static _singleton: NeoApplication

    /**
     * Holds the application services
     */
    private _services: IServiceData[] = []

    /**
     * Every loaded resource is holded here
     */
    private _repository: Repository

    /**
     * Session middleware for socket.io and express share same session object
     */
    private sessionMiddleware: any

    //Debuggers instances
    private readonly log = debug('neots:app')
    private readonly http_log = debug('neots:http')

    /**
     * Initializes a new instance which 
     * configures the initial application settings
     * 
     * @param config 
     */
    public constructor (private readonly config: NeoAppConfig){       
        this.log("Booting Neo-Application...")
        NeoApplication._singleton = this
        this.expressApp = Express()
    
        //Initialize our repostiory
        this._repository = new Repository()

        //Initialize session before all to share
        this.useSession(this.config.sessionOptions)

        //Do we have cors?
        if (!isUndefined(this.config.corsOptions))
            this.addMiddleware(cors(this.config.corsOptions))

        //Use helmet?
        if (!isUndefined(this.config.helmetOptions))
        {
            //is it just to enable?
            if (this.config.helmetOptions === true)
                this.addMiddleware(helmet())
            else if (typeof this.config.helmetOptions == 'object')
                this.addMiddleware(helmet(this.config.helmetOptions))
        }
        
        //Load express middlewares in case we have
        if (!isUndefined(this.config.middlewares) && this.config.middlewares.length > 0)
            this.addMiddlewareList(this.config.middlewares)

        //Initialize priority call before prepare routes
        this.loadSettings()
        this.expressRouter = Express.Router()
        this.configureHttpLogger()
        
        //Load our services
        if (this.config.services !== undefined && this.config.services.length > 0)
            this._services = this.config.services

        //Start our server
        if (!isUndefined(this.config.sslOptions))
            this.server = https.createServer(
                this.config.sslOptions, 
                this.expressApp
            )
        else
            this.server = http.createServer(this.expressApp)
        
        //Create socket io server
        this.eventIO = io(this.server, this.config.socketOptions)
        
        //Make sure we have session middleware in case session is on
        if (!isUndefined(this.sessionMiddleware)){
            this.addIOMiddleware( (socket: SocketIO.Socket, next: Express.NextFunction) => {
                this.sessionMiddleware(socket.request, socket.request.res || {}, next)
            })
        }

        //Load the middlewares of io
        if (!isUndefined(this.config.ioMiddlewares) && this.config.ioMiddlewares.length > 0) {
            this.addIOMiddlewareList(this.config.ioMiddlewares)
        }

        
        //Load our repository
        RepositoryFactory.load(this.config, this._repository, this.expressRouter, this.eventIO)

        //Setup express router
        this.expressApp.use(this.expressRouter)
    }

    /**
     * Neo Application Singleton instance
     * 
     * @return Application
     */
    public static get singleton() : NeoApplication {
        return this._singleton
    }

    /**
     * Loads the config default settings
     * 
     * @return void
     */
    private loadSettings() : void {
        this.addSetting('view engine', !isUndefined(this.config.viewEngine) ? this.config.viewEngine : 'ejs')
        this.addSetting('title', !isUndefined(this.config.name) ? this.config.name : 'neo-app')
        
        //Allow body json responses
        this.addMiddleware(Express.json())

        //Trust proxy for express
        const trustProxy = !(this.config.trustProxy == false)
        this.addSetting('trust proxy', trustProxy ? 1 : 0)

        //Http response compression
        this.addMiddleware(compression())

        //Disable powered by
        this.disableSetting('x-powered-by')

        this.log("Settings loaded.")
    }

    /**
     * Returns a model if found
     * @param name 
     */
    public getModel<T = any>(name: string) : T {
        for(const $ of this._repository.getLoadedModels()){
            if ($.options.alias === name)
                return $.reference as T
        }
    }

    /**
     * Loads a model if it's not loaded yet
     */
    public loadModel<T = any>(data: INeoModel) : T {
        return this._repository.loadModel(data) as T
    }

    /**
     * Enables HTTP routing logs
     */
    public configureHttpLogger() {
        this.expressRouter.use( (req,res,next) => {
            this.http_log(req.method + ' ' + req.url)
            next()
        })
    }

    /**
     * Adds a new middleware to express
     * 
     * @param middleware Express.Handler
     * 
     * @return this
     */
    public addMiddleware( middleware: Express.Handler ) : this {
        this.expressApp.use( middleware )
        return this
    }
    
    /**
     * Adds a new middleware to low-level io
     * @param middleware 
     */
    public addIOMiddleware( fn: IoMiddleware ) : this {
        this.eventIO.use(fn)
        return this
    }

    /**
     * Adds a list of middlewares to express
     *
     * @param {Express.Handler[]} middlewares
     * @memberof Application
     */
    public addMiddlewareList( middlewares: Express.Handler[] ) : void {
        if (middlewares.length > 0)
            middlewares.map( (fn) => {
                this.expressApp.use( fn )
            })
    }

    /**
     * Adds a list of middlewares to socketio
     *
     * @param {Express.Handler[]} middlewares
     * @memberof Application
     */
    public addIOMiddlewareList( middlewares: IoMiddleware[] ) : void {
        if (middlewares.length > 0)
            middlewares.map( (fn) => {
                this.eventIO.use( fn )
            })
    }

    /**
     * Adds a new setting for express
     *
     * @param {string} key
     * @param {string} value
     * @memberof Application
     */
    public addSetting(setting: string, value: any){
        this.expressApp.set(setting, value);
    }

    /**
     * Disables a express setting
     * @param setting string
     */
    public disableSetting(setting: string){
        this.expressApp.disable(setting)
    }

    /**
     * Enables a express setting
     * @param setting string
     */
    public enableSetting(setting: string){
        this.expressApp.enable(setting)
    }

    /**
     * Returns low level instance of Express Application
     * Use this carefully since TOPFramework is written in top
     * of this instance
     * 
     */
    public get httpServer () : Express.Application {
        return this.expressApp
    }

    /**
     * Returns express router instance
     */
    public get httpRouter () : Express.Router {
        return this.expressRouter
    }

    /**
     * Returns the socket.io instance in order
     * to bind events
     * 
     */
    public get io () : SocketIO.Server | undefined { 
        return this.eventIO
    }
    /**
     * Enables session
     * @param options SessionOptions
     */
    private useSession(options?: SessionOptions) : this {
        if (options !== undefined)
        {
            //Express-session middleware
            this.sessionMiddleware = session(options)
            this.addMiddleware(this.sessionMiddleware)

            this.log("Session has been created and shared with socket.io")
        }
        return this
    }


    /**
     * Returns a loaded service if exist
     */
    public getService<T = any>(name: string) : T {
        for(const e of this._services)
            if (e.name === name)
                return e.instance as T
    }

    /**
     * Loads a service
     * @param data 
     */
    public loadService(data: IServiceData) : void {
        if (this._services.filter(e => e.name === data.name) === undefined)
            this._services.push(data)
        else
            throw new Error(`${data.name} service is already loaded.`)
    }
    
    /**
     * Define a name for powered-by
     * @param name 
     */
    public setPoweredBy(name: string) : NeoApplication {
        this.addMiddleware(helmet.hidePoweredBy({ setTo: name}))
        return this
    }

    /**
     * Boots the application
     * 
     * @param Function callback
     * 
     * @return void 
     */
    public start( onStart?: Function ) : void {
        if (!isUndefined(this.config) && typeof !isUndefined(this.config.port))
        {
            this.server.listen(this.config.port, () => {
                this.log("Neo-Application has started listening on port %s", this.config.port)
                if (onStart) onStart()
            })
        }
    }
}