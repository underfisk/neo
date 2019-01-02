/**
 * Abstraction to establish what a database adapter
 * must have
 * 
 * @package Neo
 */
export abstract class Adapter
{
    /**
     * Returns the driver connection to a callback
     * @param callback 
     */
    abstract getConnection() : any

    /**
     * Returns the result of a query and executes it
     * @param sql 
     * @param args 
     */
    abstract query(sql: string, args?: any[]) : Promise<any>
}