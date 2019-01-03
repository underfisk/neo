import { 
    PoolConfig, 
    PoolConnection, 
    createPool, 
    Pool, 
    MysqlError
} from 'mysql'
import { Adapter } from './adapter';
import { Logger } from '../../common/logger';
import { isUndefined } from 'util';

/**
 * Mysql driver adapter using mysql module for database
 * 
 * @author Enigma
 * @package Neo
 */
export class MysqlAdapter extends Adapter
{
    /**
     * Creates a mysql pool
     */
    private pool: Pool

    constructor(private readonly config: PoolConfig){
        super()
        this.pool = createPool(this.config)
        this.pool.on('error', this.onError)
        this.pool.on('close', this.onClose)
        Logger.log(`Connecting to the remote database ${config.database}, ${config.host} with login ${config.user}:${config.password} `)
        this.initialConnection()
    }

    /**
     * Returns the pool connection
     * @param callback 
     */
    public async getConnection() : Promise<any> {
        return new Promise( (resolve, reject) => {
            this.pool.getConnection( (err, conn) => {
                if (err) reject(err)
                resolve(conn)
            })
        })
    }

    /**
     * Initializes a connection in order to know whether
     * the server is available and valid
     */
    private initialConnection() : void {
        this.pool.getConnection( (err: MysqlError, conn: PoolConnection) => {
            if (err){
                this.filterConnectionError(err)
                return
            }
            if (conn) conn.release()
        })
    }

    /**
     * On mysql driver error
     * 
     * @param err 
     */
    public onError(err: string) : void {
        Logger.log(err)
    }
    
    /**
     * On mysql driver close
     * @param err 
     */
    public onClose(err: string) : void {
        Logger.log(err)
    }

    /**
     * Filters the mysql driver error
     * @param err 
     */
    private filterConnectionError(err: MysqlError) : void {
        if (err.code === 'PROTOCOL_CONNECTION_LOST')
            Logger.error('Database connection was closed.')
        else if (err.code === 'ER_CON_COUNT_ERROR')
            Logger.error('Database has too many connections.')
        else if (err.code === 'ERCONNREFUSED')
            Logger.error('Database connection was refused.')
        else
            Logger.error(err.message)
    }

    /**
     * Executes a simple query with a given sql command and notifies when is complete
     * 
     * @param {string} sql
     * @param {*} args
     * 
     * @return {object|json}
     */
    public async query (sql: string, args?: any[]) : Promise<any> {
        return new Promise( (resolve, reject) => {
            this.pool.getConnection( (err, con) => {
                if (err) 
                {
                    this.filterConnectionError(err)
                    reject(err)
                }
    
                con.query( sql, args, (err, rows) => {
                    con.release()
                    if (err) reject(err)
                    resolve(rows)
                })
            })
        })
    }

    /**
     * Performs a Stored procedura query but offers potential things such as
     * no required to set CALL nor the escape
     * 
     * @param stored_procedure_name 
     * @param args 
     */
    public async spQuery(stored_procedure_name: string, args: any[]) : Promise<any> {
        let sql = `CALL ${stored_procedure_name}(${this.bindMark(args.length)})`
        return new Promise( (resolve, reject) => {
            this.query(sql, args).then( rows => {
                resolve( !isUndefined(rows) ? rows[0] : undefined)
            }).catch( err => {
                reject(err)
            })
        })
    }

    /**
     * Returns a string with the size of marks needed for SP
     * @param size 
     */
    private bindMark(size: number) : string {
        let str: string = ""
        for(let i = 0; i < size; i++)
        {
            if (i === size - 1) //last
                str += '?'
            else
                str += '?,'
        }
        return str
    } 
}