import {Handler } from 'express'
import {ServerOptions} from 'https'
import {SessionOptions} from 'express-session'
import { PoolConfig } from 'mysql';
import { IValuePair } from '../../common/collections/valuepair';
import { ConnectionOptions } from 'typeorm';
import { CorsOptions } from 'cors';
import * as helmet from 'helmet';
import { IExpressMiddleware } from '../../common/decorators/http-middleware';
import { IoMiddleware } from '../neo-app';

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
     * Allow HTTPS server creation?
     * If you set this to true, please send sslOptions
     * @deprecated By sending sslOptions this will not be necessary
     */
    https?: boolean,
    /**
     * If you want mysql just give a pool config
     * and it will try to open a pool
     * @deprecated Will be removed
     */
    mysqlConfig?: PoolConfig,
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
     * SSL Options to be loaded while creating a
     * HTTPS Server instance
     * @default none
     */
    sslOptions?: ServerOptions,
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
     * Server port to be running http(s)/socket server
     * @required
     */
    port: number,
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
     * @deprecated Will be removed
     */
    databaseORM?: any
    /**
     * Define whether you want to use a database ORM
     * which in case is TypeORM
     * @see https://github.com/typeorm/typeorm
     * @default false
     * @deprecated Will be removed
     */
    databaseOrm?: ConnectionOptions,
    /**
     * If you are using some proxy reverse such as Nginx
     * please set this to true
     * @default false
     */
    trustProxy?: boolean,
    /**
     * Provide the list of serving directories in case
     * you want to serve web resources
     * @default []
     * @todo Will be changed 
     */
    staticFilesDirs?: IValuePair<string,string>[],
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