"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg = require("pg");
class PostgresAdapter {
    constructor(options) {
        this.pool = new pg.Pool(options);
    }
    /**
     * Returns the connection to the given callback
     * @param fn
     */
    getConnection(fn) {
        this.pool.connect(fn);
    }
    /**
     * Returns a promise with the connection
     */
    async getAsyncConnection() {
        return new Promise((a, b) => {
            this.pool.connect((err, client) => {
                if (err)
                    b(err);
                else
                    a(client);
            });
        });
    }
    /**
     * Performs an sql query
     */
    async query(sql, args) {
        return new Promise((a, b) => {
            this.getConnection((err, client) => {
                if (err) {
                    b(err);
                    return;
                }
                client.query(sql, args).then(res => {
                    client.release();
                    a(res);
                })
                    .catch(ex => {
                    b(ex);
                });
            });
        });
    }
    close(onClose) {
        this.pool = null;
    }
}
exports.PostgresAdapter = PostgresAdapter;
