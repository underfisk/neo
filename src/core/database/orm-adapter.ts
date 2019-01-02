import { Adapter } from './adapter';
import { ConnectionOptions, createConnection, Connection, getConnection as getConn, QueryBuilder, createQueryBuilder, Entity, SelectQueryBuilder } from 'typeorm';
import { isUndefined } from 'util';
import * as debug from 'debug'
import { Logger } from '../../common';

/**
 * Creates a new TypeORM Adapter
 * 
 * @package Neo
 * @author Rodrigo Rodrigues
 */
export class ORMAdapter extends Adapter
{
    /**
     * Receives the options for TypeORM and also a onConnection callback
     * @param options 
     * @param onConnect 
     */
    constructor(private readonly options: ConnectionOptions, private readonly onConnect: Function){
        super()
        this.createConnection()
    }    
    
    /**
     * Performs a connection the the target database with the injected options
     * 
     * @return void
     */
    public async createConnection() : Promise<void>{
        await createConnection(this.options)
            .then(connection => {
                // here you can start to work with your entities
                Logger.log("Database ORM was been created")
                this.onConnect()
        }).catch(Logger.error)
    }

    /**
     * Returns ORM Connection instance
     * @param name 
     */
    public getConnection(name?: string) : Connection {
        return getConn(name)
    }
    /**
     * Returns ORM Query builder instance
     * 
     * @param entity 
     * @param alias 
     */
    public createQueryBuilder<Entity>(entity?: any, alias?: string) : SelectQueryBuilder<Entity> {
        return createQueryBuilder(entity,alias)
    }

    /**
     * Returns a raw query result
     * @param sql 
     * @param args 
     */
    public query(sql:string, args?: any[]) : Promise<any> {
        return new Promise( (resolve,reject) => {
            this.getConnection().query(sql, args).then( rows => {
                resolve( !isUndefined(rows) ? rows : undefined )
            }).catch( err => {
                reject(err)
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
            this.getConnection().query(sql, args).then( rows => {
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