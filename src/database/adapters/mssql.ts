import * as mssql from 'mssql'

/**
 * Neots SQL Server adapter to offer
 * additional features and database support
 */
class MssqlAdapter {
    /**
     * Pool instance
     */
    private pool: mssql.ConnectionPool


    constructor(options: mssql.config){
        this.init(options)
    }

    /**
     * Initializes our adapter
     * @param options 
     */
    private async init(config: mssql.config) : Promise<void> {
        this.pool = await new mssql.ConnectionPool(config)
        this.pool.connect(this.onConnect)
        this.pool.on('error', this.onError)
    }

    /**
     * Notified when a connection is established
     * @param err 
     */
    private onConnect(err?: any) : void {
        console.log(err)
    }

    private onError(err?: any) : void {
        console.log(err)
    }

    /**
     * Returns the connection to the provided callback
     * @param fn 
     */
    public getConnection( fn: Function) : void {
        fn(this.pool)
    }

    /**
     * Returns a promise with the connection
     * Compatible with async/await
     */
    public getAsyncConnection() : Promise<mssql.ConnectionPool> {
        return new Promise( (a,b) => {
            if (!this.pool.connected)
                b('No connection available')
            else
                a(this.pool)
        })
    }

    public query(sql: TemplateStringsArray, args?: any[]) : Promise<any> {
        return new Promise( (a,b) => {
            //this.pool.query(sql, args).then( )
        })
    }
}


export default MssqlAdapter