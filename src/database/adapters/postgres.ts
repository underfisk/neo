import * as pg from 'pg'
import { SqlAdapter } from './sql-adapter';

export class PostgresAdapter implements SqlAdapter  {
    private pool: pg.Pool

    constructor(options: pg.PoolConfig) {
        this.pool = new pg.Pool(options)
    }

    /**
     * Returns the connection to the given callback
     * @param fn 
     */
    public getConnection( fn: (err: Error, client: pg.PoolClient) => any) : void {
        this.pool.connect(fn)
    }

    /**
     * Returns a promise with the connection
     */
    public async getAsyncConnection() : Promise<any> {
        return new Promise( (a,b) => {
            this.pool.connect( (err, client) => {
                if (err) 
                    b(err)
                else
                    a(client)
            })
        })
    }

    /**
     * Performs an sql query
     */
    public async query(sql: any, args: any[]) : Promise<any> {
        return new Promise( (a,b) => {
            this.getConnection( (err, client) => {
                if(err){
                    b(err)
                    return
                }
                client.query(sql, args).then( res => {
                    client.release()
                    a(res)
                })
                .catch(ex => {
                    b(ex)
                })
            })
        })
    }

    public close( onClose?: Function) : void {
        this.pool = null
    }
}
