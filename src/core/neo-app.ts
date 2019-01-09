import * as Express from 'express'
import * as http from 'http'
import * as https from 'https'
import * as io from 'socket.io';
import * as debug from 'debug'
import * as errorhandler from 'errorhandler'
import * as session from 'express-session'
import { PackageFactory } from './package/package-factory';
import { SessionOptions } from 'express-session';
import * as compression from 'compression'
import * as cors from 'cors'
import * as helmet from 'helmet'
import { Adapter } from './database/adapter';
import { MysqlAdapter } from './database/mysql-adapter';
import { TransportOptions } from 'nodemailer';
import EmailService from '../services/email';
import { IValuePair } from '../common/collections/valuepair';
import { ORMAdapter } from './database/orm-adapter';
import { isUndefined } from 'util';
import { NeoAppConfig } from './interfaces/app-config';
import { Package } from './interfaces/package';

/**
 * Temporary here
 * Used to create boot socketio middelware loading
 */
export interface IoMiddleware {
    (socket: SocketIO.Socket, next: any) : void
}

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
     * PackageFactory instance to load packages and depedencies
     */
    private packageFactory: PackageFactory

    /**
     * Database adapter for models di
     */
    private dbAdapter?: MysqlAdapter | ORMAdapter

    /**
     * Email service to general use not locked to instance
     */
    private static emailServiceSingleton?: EmailService

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
    public constructor (default_package: Package, private readonly config: NeoAppConfig){       
        //Say we are botting
        this.log("Booting Neo-Application...")

        //Initialize core instances
        this.expressApp = Express()
    
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


        //Initialize our router
        this.expressRouter = Express.Router()

        //Initialize our singleton
        if (typeof NeoApplication._singleton == 'undefined')
            NeoApplication._singleton = this

        //Start our server
        if (!isUndefined(this.config.https) && !isUndefined(this.config.sslOptions))
            this.server = https.createServer(
                this.config.sslOptions, 
                this.expressApp
            )
        else
            this.server = http.createServer(this.expressApp)
        
        //Configures socket.io with our server to be shared 
        this.eventIO = io.listen(this.server, this.config.socketOptions) 

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
        //Initialize priority call before prepare routes
        this.loadStaticDirectories()

        //Initialize mysql for models if typeORM is not on
        this.loadDatabaseContext(default_package)

        //Load the middleware for stack error in dev
        if (process.env.NODE_ENV !== 'production')
            this.expressApp.use( errorhandler() )

        //Setup our router debugger
        this.configureHttpLogger()

        //Setup express router
        this.expressApp.use(this.expressRouter)

        //Load settings
        this.loadSettings()

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
     * Must be called before Routing
     * 
     * @return void
     */
    private loadStaticDirectories () : void {

        //Define static directory
        if (!isUndefined(this.config.staticFilesDirs)&& this.config.staticFilesDirs.length > 0)
        {
            this.config.staticFilesDirs.map( (ele : IValuePair<string,string>) => {
                if (ele.key == "" && ele.value != "")
                    this.addMiddleware(Express.static(ele.value))
                else
                    this.addStatic(ele.key, ele.value)
           })
        }
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
     * Loads the database adapter and processes the package
     * @param default_package 
     */
    private loadDatabaseContext(default_package: Package) : void {
        if (!isUndefined(this.config.mysqlConfig) && isUndefined(this.config.databaseOrm))
        {
            this.dbAdapter = new MysqlAdapter(this.config.mysqlConfig)
            this.loadDefaultPackage(default_package)
        }
        else if (!isUndefined(this.config.databaseOrm))
        {
            this.dbAdapter = new ORMAdapter(this.config.databaseOrm, () => {
                //Once the ORM creates a connection load package
                this.loadDefaultPackage(default_package)
            })
        }
        else
        {
            this.loadDefaultPackage(default_package) //without database
        }
    }

    /**
     * Loads the default package
     * @param default_package 
     */
    private loadDefaultPackage (default_package: Package) : void {
        //Process the given package
        this.packageFactory = new PackageFactory(this.expressRouter, this.eventIO, this.dbAdapter)
        this.packageFactory.process(default_package)
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
     * Adds a static resource for express
     * 
     * @param urlPath 
     * @param dirPath 
     */
    public addStatic( urlPath: string, dirPath: string) : void {
        this.log(`Creating a static directory for urlpath=${urlPath} with directory=${dirPath}`)
        this.expressApp.use( urlPath, Express.static(dirPath))
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
     * Returns the database adapter in case is provided info
     */
    public get database () : MysqlAdapter | ORMAdapter | undefined {
        return this.dbAdapter
    }

    /**
     * Enables Email service using NodeMailer
     * @param options 
     */
    public useEmailService( options?: TransportOptions) : this {
        NeoApplication.emailServiceSingleton = new EmailService(options)     
        return this
    }

    /**
     * Email service singleton
     */
    public static get EmailService() : EmailService {
        return NeoApplication.emailServiceSingleton
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