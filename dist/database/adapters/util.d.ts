import { IMysqlObjectLiteral } from "./interfaces/sql";
/**
 * Returns a bind mark separed wih commas
 * @param size
 */
export declare function bindMarks(size: number): string;
/**
 * Returns a transformed set string for sql update query (values come
 * escaped using sqlstring module)
 *
 * @param data
 */
export declare function transformSet(data: IMysqlObjectLiteral[]): any;
