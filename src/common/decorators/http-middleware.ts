import { Request, Response, NextFunction } from 'express';
import { HTTP_MIDDLEWARE } from '../../constants';

/**
 * Middleware especificies whether you want a function to be called before
 * the given route below
 * 
 * @param fn 
 */
export function Middleware( fn: (req: Request, res: Response, next: NextFunction) => void ) : MethodDecorator {
    return (target: object, key, descriptor) => {
        Reflect.defineMetadata(HTTP_MIDDLEWARE, fn, descriptor.value)
        return descriptor
    }
}