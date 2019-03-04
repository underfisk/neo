"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const util_1 = require("./util");
const debug = require("debug");
/**
 * Neots mysql adapter to offer additional
 * functionalities and database support
 */
class MysqlAdapter {
    constructor(options, manualStart = false) {
        this.options = options;
        /**
         * Private logger for mysql internal logs
         */
        this.log = debug('neodb::mysql');
        this.log("Pool has been created");
        if (!manualStart) {
            this.pool = mysql.createPool(this.options);
            this.pool.on('error', this.onError);
            this.pool.on('close', this.onClose);
        }
    }
    /**
     * Manually starts the pool if it's not yet
     */
    connect() {
        if (this.pool === undefined) {
            this.pool = mysql.createPool(this.options);
            this.pool.on('error', this.onError);
            this.pool.on('close', this.onClose);
        }
    }
    /**
     * Closes and disposes our pool
     */
    close(onEnd) {
        this.pool.end(onEnd);
        this.pool = null; //dispose for gc
    }
    /**
     * Set a configuration option
     * @param name
     * @param value
     */
    setConfig(name, value) {
        this.pool.config[name] = value;
    }
    /**
     * Notified when an error occurs
     * @param err
     */
    onError(err) {
        this.filterConnectionError(err);
    }
    /**
     * Notified when the pool is closed
     * @param err
     */
    onClose(err) {
        this.log(err);
    }
    /**
     * Filters the mysql driver error
     * @param err
     */
    filterConnectionError(err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST')
            this.log('Database connection was closed.');
        else if (err.code === 'ER_CON_COUNT_ERROR')
            this.log('Database has too many connections.');
        else if (err.code === 'ERCONNREFUSED')
            this.log('Database connection was refused.');
        else
            this.log(err.message);
    }
    /**
     * Returns the connection to the provided callback
     */
    getConnection(callback) {
        this.pool.getConnection(callback);
    }
    /**
     * Returns a promise with the pool connection
     * Compabitle with async/await
     */
    async getAsyncConnection() {
        return new Promise((a, b) => {
            this.pool.getConnection((err, conn) => {
                if (err)
                    b(err);
                else
                    a(conn);
            });
        });
    }
    /**
     * Executes a raw query with a given sql command and notifies when is complete
     *
     * @param sql
     * @param args
     */
    async query(sql, args) {
        return new Promise((a, b) => {
            //check if is already disposed
            if (this.pool === null || this.pool === undefined) {
                b("Pool has already been disposed.");
                return;
            }
            this.pool.getConnection((err, conn) => {
                if (err) {
                    b(err);
                    return;
                }
                conn.query(sql, args, (err, rows) => {
                    conn.release();
                    if (err) {
                        b(err);
                        return;
                    }
                    a(rows);
                });
            });
        });
    }
    /**
     * Executes a stored procedure with the provided name and list of arguments
     *
     * @example adapter.storedProcedure('Name', [arg1,arg2])
     * @param sp_name
     * @param args
     */
    async storedProcedure(sp_name, args) {
        let sql = `CALL ${sp_name}()`;
        if (args !== undefined && args.length > 0)
            sql = `CALL ${sp_name}(${util_1.bindMarks(args.length)})`;
        return new Promise((a, b) => {
            this.query(sql, args).then(rows => {
                a(rows !== undefined ? rows[0] : undefined);
            }).catch(err => {
                b(err);
            });
        });
    }
}
exports.MysqlAdapter = MysqlAdapter;
