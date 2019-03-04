import * as pg from 'pg';
import { SqlAdapter } from './sql-adapter';
export declare class PostgresAdapter implements SqlAdapter {
    private pool;
    constructor(options: pg.PoolConfig);
    /**
     * Returns the connection to the given callback
     * @param fn
     */
    getConnection(fn: (err: Error, client: pg.PoolClient) => any): void;
    /**
     * Returns a promise with the connection
     */
    getAsyncConnection(): Promise<any>;
    /**
     * Performs an sql query
     */
    query(sql: any, args: any[]): Promise<any>;
    close(onClose?: Function): void;
}
