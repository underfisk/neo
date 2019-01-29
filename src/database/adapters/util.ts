import { IMysqlObjectLiteral } from "./interfaces/sql";
import { escape as mysqlEscape } from 'mysql'
/**
 * Returns a bind mark separed wih commas
 * @param size 
 */
export function bindMarks(size: number) : string {
    let str: string = ""
    for(let i = 0; i < size; i++) {
        if (i === size - 1) //last
            str += '?'
        else
            str += '?,'
    }
    return str
} 

    /**
     * Returns a transformed set string for sql update query (values come
     * escaped using mysql.escape function)
     * @param data 
     */
export function transformSet(data: IMysqlObjectLiteral[]) : any {
    let transformed = ''

    data.map( (obj: IMysqlObjectLiteral, index) => {
        transformed += (`${obj.column} = ${mysqlEscape(obj.value)}`)
        if (index !== data.length - 1 )
            transformed += (',')
    })
    return transformed
}