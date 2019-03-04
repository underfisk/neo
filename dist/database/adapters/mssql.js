"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mssql = require("mssql");
/**
 * Neots SQL Server adapter to offer
 * additional features and database support
 */
class MssqlAdapter {
    constructor(options) {
        this.init(options);
    }
    /**
     * Initializes our adapter
     * @param options
     */
    async init(config) {
        this.pool = await new mssql.ConnectionPool(config);
        this.pool.connect(this.onConnect);
        this.pool.on('error', this.onError);
    }
    /**
     * Notified when a connection is established
     * @param err
     */
    onConnect(err) {
        console.log(err);
    }
    onError(err) {
        console.log(err);
    }
    /**
     * Returns the connection to the provided callback
     * @param fn
     */
    getConnection(fn) {
        fn(this.pool);
    }
    /**
     * Returns a promise with the connection
     * Compatible with async/await
     */
    getAsyncConnection() {
        return new Promise((a, b) => {
            if (!this.pool.connected)
                b('No connection available');
            else
                a(this.pool);
        });
    }
    query(sql, args) {
        return new Promise((a, b) => {
            //this.pool.query(sql, args).then( )
        });
    }
}
exports.default = MssqlAdapter;
