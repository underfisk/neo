/**
 * Provides an way of giving key-value data for update queries
 */
export interface IMysqlObjectLiteral {
    column: string,
    value: any
}

/**
 * Provies a way of receiving a function
 */
export interface IConnectionFunction<T,R> {
    (err: T, conn: R) : any
}