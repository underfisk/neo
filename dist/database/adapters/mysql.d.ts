import * as mysql from 'mysql';
import { IConnectionFunction } from './interfaces/sql';
import { SqlAdapter } from './sql-adapter';
/**
 * Neots mysql adapter to offer additional
 * functionalities and database support
 */
export declare class MysqlAdapter implements SqlAdapter {
    private readonly options;
    /**
     * Instance of mysql pooling
     */
    private pool;
    /**
     * Private logger for mysql internal logs
     */
    private log;
    constructor(options: string | mysql.PoolConfig, manualStart?: boolean);
    /**
     * Manually starts the pool if it's not yet
     */
    connect(): void;
    /**
     * Closes and disposes our pool
     */
    close(onEnd?: (err?: any) => void): void;
    /**
     * Set a configuration option
     * @param name
     * @param value
     */
    setConfig(name: string, value: any): void;
    /**
     * Notified when an error occurs
     * @param err
     */
    private onError;
    /**
     * Notified when the pool is closed
     * @param err
     */
    private onClose;
    /**
     * Filters the mysql driver error
     * @param err
     */
    private filterConnectionError;
    /**
     * Returns the connection to the provided callback
     */
    getConnection(callback: IConnectionFunction<mysql.MysqlError, mysql.PoolConnection>): void;
    /**
     * Returns a promise with the pool connection
     * Compabitle with async/await
     */
    getAsyncConnection(): Promise<any>;
    /**
     * Executes a raw query with a given sql command and notifies when is complete
     *
     * @param sql
     * @param args
     */
    query(sql: string, args?: any[]): Promise<any>;
    /**
     * Executes a stored procedure with the provided name and list of arguments
     *
     * @example adapter.storedProcedure('Name', [arg1,arg2])
     * @param sp_name
     * @param args
     */
    storedProcedure(sp_name: string, args?: any[]): Promise<any>;
}
