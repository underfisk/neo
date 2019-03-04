import * as mssql from 'mssql';
/**
 * Neots SQL Server adapter to offer
 * additional features and database support
 */
declare class MssqlAdapter {
    /**
     * Pool instance
     */
    private pool;
    constructor(options: mssql.config);
    /**
     * Initializes our adapter
     * @param options
     */
    private init;
    /**
     * Notified when a connection is established
     * @param err
     */
    private onConnect;
    private onError;
    /**
     * Returns the connection to the provided callback
     * @param fn
     */
    getConnection(fn: Function): void;
    /**
     * Returns a promise with the connection
     * Compatible with async/await
     */
    getAsyncConnection(): Promise<mssql.ConnectionPool>;
    query(sql: TemplateStringsArray, args?: any[]): Promise<any>;
}
export default MssqlAdapter;
