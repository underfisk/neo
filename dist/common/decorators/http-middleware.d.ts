import { Request, Response, NextFunction } from 'express';
import 'reflect-metadata';
/**
 * Interface made to establish express http middleware
 */
export interface IExpressMiddleware {
    (req: Request, res: Response, next: NextFunction): void;
}
/**
 * Middleware especificies whether you want a function to be called before
 * the given route below
 *
 * @example Middleware([yourExternalFunction1, 2,3..])
 * @param fn
 */
export declare function Middleware(fns: IExpressMiddleware[]): MethodDecorator;
