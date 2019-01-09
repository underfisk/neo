import {Handler } from 'express'
import {ServerOptions} from 'https'
import {SessionOptions} from 'express-session'
import { PoolConfig } from 'mysql';
import { IValuePair } from '../../common/collections/valuepair';
import { ConnectionOptions } from 'typeorm';
import { CorsOptions } from 'cors';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { IExpressMiddleware } from '../../common/decorators/http-middleware';

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
     */
    name?: string,
    /**
     * Allow HTTPS server creation?
     * If you set this to true, please send sslOptions
     */
    https?: boolean,
    /**
     * If you want mysql just give a pool config
     * and it will try to open a pool
     */
    mysqlConfig?: PoolConfig,
    /**
     * By writing something, this will enable
     * session
     */
    sessionOptions?: SessionOptions,
    /**
     * SSL Options to be loaded while creating a
     * HTTP Server instance
     */
    sslOptions?: ServerOptions,
    /**
     * Socket.io config in case you want to add
     * extra options
     * @default null
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
     * Express middlewares list in case you want
     * to autoload
     * They will be injected before express.router
     */
    middlewares?: IExpressMiddleware[],
    /**
     * Define whether you want to use a database ORM
     * which in case is TypeORM
     * @see https://github.com/typeorm/typeorm
     * @default false
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