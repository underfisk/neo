import { IConnectionFunction } from "./interfaces/sql";

/**
 * Declares some "musts" to the database adapters
 * which encourages the usage of an interface methods
 */
export abstract class SqlAdapter{
    /**
     * Returns the specific driver connection
     * in order to execute commands
     */
    public abstract getConnection(callback: IConnectionFunction<any,any>) : void
    /**
     * Returns a promise of the specific database driver connection
     * which supports async/await
     */
    public abstract getAsyncConnection() : Promise<any>
    /**
     * Executes a command in the created adapter
     */
    public abstract query(sql: string, args: any[]) : Promise<any>
    /**
     * Closes/Disposes this adapter which ensures
     * the closing of low-level driver api
     */
    public abstract close( onClose?: Function) : void
}