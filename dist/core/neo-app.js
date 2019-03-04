"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const http = require("http");
const https = require("https");
const debug = require("debug");
const io = require("socket.io");
const session = require("express-session");
const factory_1 = require("./factory");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const util_1 = require("util");
const repository_1 = require("./repository");
/**
 * Neo-Application is designed to be a single instance running
 * express and socket.io under it
 * Check the documentation for more information
 *
 * @package Neo.ts
 * @link https://github.com/underfisk/neo
 * @author Enigma
 */
class NeoApplication {
    /**
     * Initializes a new instance which
     * configures the initial application settings
     *
     * @param config
     */
    constructor(config) {
        this.config = config;
        /**
         * Holds the application services
         */
        this._services = [];
        //Debuggers instances
        this.log = debug('neots:app');
        this.http_log = debug('neots:http');
        this.log("Booting Neo-Application...");
        NeoApplication._singleton = this;
        this.expressApp = Express();
        //Initialize our repostiory
        this._repository = new repository_1.Repository();
        //Lets see if we have session
        if (this.config.sessionOptions !== undefined) {
            //Initialize session before all to share
            this.useSession(this.config.sessionOptions);
        }
        //Do we have cors?
        if (!util_1.isUndefined(this.config.corsOptions))
            this.addMiddleware(cors(this.config.corsOptions));
        //Use helmet?
        if (!util_1.isUndefined(this.config.helmetOptions)) {
            //is it just to enable?
            if (this.config.helmetOptions === true)
                this.addMiddleware(helmet());
            else if (typeof this.config.helmetOptions == 'object')
                this.addMiddleware(helmet(this.config.helmetOptions));
        }
        //Load express middlewares in case we have
        if (!util_1.isUndefined(this.config.middlewares) && this.config.middlewares.length > 0)
            this.addMiddlewareList(this.config.middlewares);
        //Initialize priority call before prepare routes
        this.loadSettings();
        this.expressRouter = Express.Router();
        this.configureHttpLogger();
        //Load our services
        if (this.config.services !== undefined && this.config.services.length > 0)
            this._services = this.config.services;
        //Start our server
        if (!util_1.isUndefined(this.config.sslOptions))
            this.server = https.createServer(this.config.sslOptions, this.expressApp);
        else
            this.server = http.createServer(this.expressApp);
        //Create socket io server
        this.eventIO = io(this.server, this.config.socketOptions);
        //Make sure we have session middleware in case session is on
        if (!util_1.isUndefined(this.sessionMiddleware)) {
            this.addIOMiddleware((socket, next) => {
                this.sessionMiddleware(socket.request, socket.request.res || {}, next);
            });
        }
        //Load the middlewares of io
        if (!util_1.isUndefined(this.config.ioMiddlewares) && this.config.ioMiddlewares.length > 0) {
            this.addIOMiddlewareList(this.config.ioMiddlewares);
        }
        //Load our repository
        factory_1.RepositoryFactory.load(this.config, this._repository, this.expressRouter, this.eventIO);
        //Setup express router
        this.expressApp.use(this.expressRouter);
    }
    /**
     * Neo Application Singleton instance
     *
     * @return Application
     */
    static get singleton() {
        if (util_1.isUndefined(this._singleton))
            throw new Error("NeoApplication singleton is not initialized.");
        return this._singleton;
    }
    /**
     * Loads the config default settings
     *
     * @return void
     */
    loadSettings() {
        this.addSetting('view engine', !util_1.isUndefined(this.config.viewEngine) ? this.config.viewEngine : 'ejs');
        this.addSetting('title', !util_1.isUndefined(this.config.name) ? this.config.name : 'neo-app');
        //Allow body json responses
        this.addMiddleware(Express.json());
        //Trust proxy for express
        const trustProxy = !(this.config.trustProxy == false);
        this.addSetting('trust proxy', trustProxy ? 1 : 0);
        //Http response compression
        this.addMiddleware(compression());
        //Disable powered by
        this.disableSetting('x-powered-by');
        this.log("Settings loaded.");
    }
    /**
     * Returns a model if found
     * @param name
     */
    getModel(name) {
        for (const $ of this._repository.getLoadedModels()) {
            if ($.options.alias === name)
                return $.reference;
        }
    }
    /**
     * Loads a model if it's not loaded yet
     */
    loadModel(data) {
        return this._repository.loadModel(data);
    }
    /**
     * Enables HTTP routing logs
     */
    configureHttpLogger() {
        this.expressRouter.use((req, res, next) => {
            this.http_log(req.method + ' ' + req.url);
            next();
        });
    }
    /**
     * Adds a new middleware to express
     *
     * @param middleware Express.Handler
     *
     * @return this
     */
    addMiddleware(middleware) {
        this.expressApp.use(middleware);
        return this;
    }
    /**
     * Adds a new middleware to low-level io
     * @param middleware
     */
    addIOMiddleware(fn) {
        this.eventIO.use(fn);
        return this;
    }
    /**
     * Adds a list of middlewares to express
     *
     * @param {Express.Handler[]} middlewares
     * @memberof Application
     */
    addMiddlewareList(middlewares) {
        if (middlewares.length > 0)
            middlewares.map((fn) => {
                this.expressApp.use(fn);
            });
    }
    /**
     * Adds a list of middlewares to socketio
     *
     * @param {Express.Handler[]} middlewares
     * @memberof Application
     */
    addIOMiddlewareList(middlewares) {
        if (middlewares.length > 0)
            middlewares.map((fn) => {
                this.eventIO.use(fn);
            });
    }
    /**
     * Adds a new setting for express
     *
     * @param {string} key
     * @param {string} value
     * @memberof Application
     */
    addSetting(setting, value) {
        this.expressApp.set(setting, value);
    }
    /**
     * Disables a express setting
     * @param setting string
     */
    disableSetting(setting) {
        this.expressApp.disable(setting);
    }
    /**
     * Enables a express setting
     * @param setting string
     */
    enableSetting(setting) {
        this.expressApp.enable(setting);
    }
    /**
     * Returns low level instance of Express Application
     * Use this carefully since TOPFramework is written in top
     * of this instance
     * @deprecated This will be renamed soon
     */
    get httpServer() {
        return this.expressApp;
    }
    /**
     * Exposes the underlayer http server
     */
    get underlayerHttpServer() {
        return this.server;
    }
    /**
     * Returns express router instance
     */
    get httpRouter() {
        return this.expressRouter;
    }
    /**
     * Returns the socket.io instance in order
     * to bind events
     *
     */
    get io() {
        return this.eventIO;
    }
    /**
     * Enables session
     * @param options SessionOptions
     */
    useSession(options) {
        //Express-session middleware
        this.sessionMiddleware = session(options);
        this.addMiddleware(this.sessionMiddleware);
        this.log("Session has been created and shared with socket.io");
        return this;
    }
    /**
     * Returns a loaded service if exist
     */
    getService(name) {
        for (const e of this._services)
            if (e.name === name)
                return e.instance;
    }
    /**
     * Loads a service
     * @param data
     */
    loadService(data) {
        if (this._services.filter(e => e.name === data.name) === undefined)
            this._services.push(data);
        else
            throw new Error(`${data.name} service is already loaded.`);
    }
    /**
     * Define a name for powered-by
     * @param name
     */
    setPoweredBy(name) {
        this.addMiddleware(helmet.hidePoweredBy({ setTo: name }));
        return this;
    }
    /**
     * Boots the application
     *
     * @param Function callback
     *
     * @return void
     */
    start(onStart) {
        if (!util_1.isUndefined(this.config) && typeof !util_1.isUndefined(this.config.port)) {
            this.server.listen(this.config.port, () => {
                this.log("Neo-Application has started listening on port %s", this.config.port);
                if (onStart)
                    onStart();
            });
        }
    }
}
exports.NeoApplication = NeoApplication;
