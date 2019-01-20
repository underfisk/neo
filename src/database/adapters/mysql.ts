import * as mysql from 'mysql'
import { bindMarks } from './util';
import { IConnectionFunction } from './interfaces/sql'
import { SqlAdapter } from './sql-adapter'
import * as debug from 'debug'

/**
 * Neots mysql adapter to offer additional 
 * functionalities and database support
 */
export class MysqlAdapter implements SqlAdapter{
    
    /**
     * Instance of mysql pooling
     */
    private pool: mysql.Pool

    /**
     * Private logger for mysql internal logs
     */
    private log: debug.IDebugger = debug('neodb::mysql')

    constructor(
        private readonly options: string | mysql.PoolConfig) {
        this.log("Pool has been created")
        this.pool = mysql.createPool(this.options)
        this.pool.on('error', this.onError)
        this.pool.on('close', this.onClose)
    }


    /**
     * Closes and disposes our pool
     */
    public close(onEnd?: (err?: any) => void) : void {
        this.pool.end(onEnd)
        this.pool = null //dispose for gc
    }


    /**
     * Notified when an error occurs
     * @param err 
     */
    private onError(err) : void {
        this.filterConnectionError(err)
    }

    /**
     * Notified when the pool is closed
     * @param err 
     */
    private onClose(err) : void {
        this.log(err)
    }

    /**
     * Filters the mysql driver error
     * @param err 
     */
    private filterConnectionError(err: mysql.MysqlError) : void {
        if (err.code === 'PROTOCOL_CONNECTION_LOST')
            this.log('Database connection was closed.')
        else if (err.code === 'ER_CON_COUNT_ERROR')
            this.log('Database has too many connections.')
        else if (err.code === 'ERCONNREFUSED')
            this.log('Database connection was refused.')
        else
            this.log(err.message)
    }


    /**
     * Returns the connection to the provided callback
     */
    public getConnection( callback: IConnectionFunction<
        mysql.MysqlError, mysql.PoolConnection>) : void {
        this.pool.getConnection(callback)
    }

    /**
     * Returns a promise with the pool connection
     * Compabitle with async/await
     */
    public async getAsyncConnection() : Promise<any> {
        return new Promise( (a,b) => {
            this.pool.getConnection( (err, conn) => {
                if (err)
                    b(err)
                else
                    a(conn)
            })
        })
    }

    /**
     * Executes a raw query with a given sql command and notifies when is complete
     * 
     * @param sql
     * @param args
     */
    public async query(sql: string, args?: any[]) : Promise<any> {
        return new Promise( (a,b) => {
            //check if is already disposed
            if (this.pool === null || this.pool === undefined){
                b("Pool has already been disposed.")
                return
            }

            this.pool.getConnection( (err, conn) => {
                if(err){
                    b(err)
                    return
                }
                conn.query(sql, args, (err, rows) => {
                    conn.release()
                    if (err) {
                        b(err)
                        return
                    }
                    a(rows)
                })
            })
        })
    }

    /**
     * Executes a stored procedure with the provided name and list of arguments
     * 
     * @example adapter.storedProcedure('Name', [arg1,arg2])
     * @param sp_name 
     * @param args 
     */
    public async storedProcedure(sp_name: string, args?: any[]) : Promise<any> {
        let sql = `CALL ${sp_name}()`
        if (args !== undefined && args.length > 0) 
            sql = `CALL ${sp_name}(${bindMarks(args.length)})`

        return new Promise( (a,b) => {
            this.query(sql, args).then(rows => {
                a( rows !== undefined ? rows[0] : undefined )
            }).catch( err => {
                b( err )
            })
        })
    }
}