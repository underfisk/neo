import {Handler } from 'express'
import {ServerOptions} from 'https'
import {SessionOptions} from 'express-session'
import { PoolConfig } from 'mysql';
import { ConnectionOptions } from 'typeorm';
import { CorsOptions } from 'cors';
import * as helmet from 'helmet';
import { IExpressMiddleware } from '../../common/decorators/http-middleware';
import { IoMiddleware} from '../interfaces/io'
import { SqlAdapter } from '../../database/adapters/sql-adapter'
import { IServiceData } from './neo';
import { Constructable } from '../../common/constructable';

/**
 * Application configuration is the boot configuration seed
 * that is provided to Neo Application in order to know
 * what to setup or load
 * 
 * @package Neo.ts
 * @author Enigma
 */
export interface NeoAppConfig {
    /**
     * Application name
     * @default neo-application
     */
    name?: string,
    /**
     * Server port to be running http(s)/socket server
     * @required
     */
    port: number,
    /**
     * If you want HTTP's provide the
     * SSL Options to be loaded in order to create a
     * HTTPS Server
     * @default none
     */
    sslOptions?: ServerOptions,
    /**
     * Application services
     * @see Documentation
     */
    services?: IServiceData[],
    /**
     * Models are likely as data providers and the data manipularors
     * By providing a model, he will be added into the model repository
     * and passed to controllers and listeners
     * Also you can access to them via `NeoApplication.singleton`
     */
    models?: Constructable<any>[],
    /**
     * Controllers are the route handlers when something hit
     * the desired URL
     */
    controllers?: Constructable<any>[],
    /**
     * Listeners are our event handlers for socket.io
     */
    listeners?: Constructable<any>[],
    /**
     * Provide any of Neots database module adapter instance
     * in order to injection to your models via DI
     * ** Note ** This will be verified and passed first rather than
     * unsafe database so if you wan't unsafe just dont set this property
     * @default none
     */
    database?: SqlAdapter,
    /**
     * Provide any database instance you have created to be passed
     * to your models.
     * 
     * Warning: By passing unsafe database we cannot
     * guarantee the connection is alive and notify in case it don't
     * @default none
     */
    unsafeDatabase?: any
    /**
     * Express session configuration
     * In order to enable session's please 
     * provide the required options.
     * Remmeber: Express session is shared 
     * if you have socketio enabled
     * @default
     */
    sessionOptions?: SessionOptions,
    /**
     * SocketIO server configuration
     * In order to enable socket.io server you need
     * to provide the server options
     * 
     * @default none
     */
    socketOptions?: SocketIO.ServerOptions,
    /**
     * Server hostname for remote connection
     * @default localhost
     */
    hostname?: string,
    /**
     * Express response view engine
     * @default ejs
     */
    viewEngine?: string,
    /**
     * Express middlewares list in case you want to do 
     * something before router being hit
     * They will be injected before express.router
     * @see https://expressjs.com/en/guide/using-middleware.html
     */
    middlewares?: IExpressMiddleware[],
    /**
     * SocketIO middleware list in case you want to do 
     * something before events being called
     * @see https://socket.io/docs/server-api/
     */
    ioMiddlewares?: IoMiddleware[],
    /**
     * If you are using some proxy reverse such as Nginx
     * please set this to true
     * @default false
     */
    trustProxy?: boolean,
    /**
     * Enable CORS module with the provided options
     */
    corsOptions?: CorsOptions,
    /**
     * Enables Http protection using helmet module
     *
     * @type {helmet.IHelmetConfiguration}
     * @memberof AppConfig
     */
    helmetOptions?: boolean| helmet.IHelmetConfiguration

}
