import { Request, Response, NextFunction } from 'express';
import { HTTP_MIDDLEWARE } from '../../constants';
import 'reflect-metadata'
/**
 * Interface made to establish express http middleware
 */
export interface IExpressMiddleware {
    (req: Request, res: Response, next: NextFunction) : void
}

/**
 * Middleware especificies whether you want a function to be called before
 * the given route below
 * 
 * @example Middleware([yourExternalFunction1, 2,3..])
 * @param fn 
 */
export function Middleware( fns: IExpressMiddleware[]) : MethodDecorator {
    return (target: object, key, descriptor) => {
        Reflect.defineMetadata(HTTP_MIDDLEWARE, fns, descriptor.value)
        return descriptor
    }
}
