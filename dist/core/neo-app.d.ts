/// <reference types="node" />
/// <reference types="socket.io" />
import * as Express from 'express';
import * as http from 'http';
import * as https from 'https';
import { NeoAppConfig } from './interfaces/app-config';
import { IoMiddleware } from './interfaces/io';
import { IServiceData, INeoModel } from './interfaces';
/**
 * Neo-Application is designed to be a single instance running
 * express and socket.io under it
 * Check the documentation for more information
 *
 * @package Neo.ts
 * @link https://github.com/underfisk/neo
 * @author Enigma
 */
export declare class NeoApplication {
    private readonly config;
    /**
     * Express.Application instance
     */
    private readonly expressApp;
    /**
     * Express.Router instance
     */
    private readonly expressRouter;
    /**
     * Server is defined according to provided config option
     */
    private readonly server;
    /**
     * SocketIO.Server instance
     */
    private readonly eventIO?;
    /**
     * Singleton of this application
     */
    private static _singleton;
    /**
     * Holds the application services
     */
    private _services;
    /**
     * Every loaded resource is holded here
     */
    private _repository;
    /**
     * Session middleware for socket.io and express share same session object
     */
    private sessionMiddleware;
    private readonly log;
    private readonly http_log;
    /**
     * Initializes a new instance which
     * configures the initial application settings
     *
     * @param config
     */
    constructor(config: NeoAppConfig);
    /**
     * Neo Application Singleton instance
     *
     * @return Application
     */
    static readonly singleton: NeoApplication;
    /**
     * Loads the config default settings
     *
     * @return void
     */
    private loadSettings;
    /**
     * Returns a model if found
     * @param name
     */
    getModel<T = any>(name: string): T;
    /**
     * Loads a model if it's not loaded yet
     */
    loadModel<T = any>(data: INeoModel): T;
    /**
     * Enables HTTP routing logs
     */
    configureHttpLogger(): void;
    /**
     * Adds a new middleware to express
     *
     * @param middleware Express.Handler
     *
     * @return this
     */
    addMiddleware(middleware: Express.Handler): this;
    /**
     * Adds a new middleware to low-level io
     * @param middleware
     */
    addIOMiddleware(fn: IoMiddleware): this;
    /**
     * Adds a list of middlewares to express
     *
     * @param {Express.Handler[]} middlewares
     * @memberof Application
     */
    addMiddlewareList(middlewares: Express.Handler[]): void;
    /**
     * Adds a list of middlewares to socketio
     *
     * @param {Express.Handler[]} middlewares
     * @memberof Application
     */
    addIOMiddlewareList(middlewares: IoMiddleware[]): void;
    /**
     * Adds a new setting for express
     *
     * @param {string} key
     * @param {string} value
     * @memberof Application
     */
    addSetting(setting: string, value: any): void;
    /**
     * Disables a express setting
     * @param setting string
     */
    disableSetting(setting: string): void;
    /**
     * Enables a express setting
     * @param setting string
     */
    enableSetting(setting: string): void;
    /**
     * Returns low level instance of Express Application
     * Use this carefully since TOPFramework is written in top
     * of this instance
     * @deprecated This will be renamed soon
     */
    readonly httpServer: Express.Application;
    /**
     * Exposes the underlayer http server
     */
    readonly underlayerHttpServer: http.Server | https.Server;
    /**
     * Returns express router instance
     */
    readonly httpRouter: Express.Router;
    /**
     * Returns the socket.io instance in order
     * to bind events
     *
     */
    readonly io: SocketIO.Server | undefined;
    /**
     * Enables session
     * @param options SessionOptions
     */
    private useSession;
    /**
     * Returns a loaded service if exist
     */
    getService<T = any>(name: string): T;
    /**
     * Loads a service
     * @param data
     */
    loadService(data: IServiceData): void;
    /**
     * Define a name for powered-by
     * @param name
     */
    setPoweredBy(name: string): NeoApplication;
    /**
     * Boots the application
     *
     * @param Function callback
     *
     * @return void
     */
    start(onStart?: Function): void;
}
