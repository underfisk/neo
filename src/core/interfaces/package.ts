import { Handler } from 'express';
import { Constructable } from '../../common/collections/constructable';
import { INeoModel } from '../interfaces/neo-model';

/**
 * TransformedPackage is used to hold loaded resources and not any type
 * references
 * 
 * @package Neo.package
 */
export interface TransformedPackage
{
    readonly name: string,
    controllers?: Constructable<any>[], //for now soon IHttpController
    configs?: JSON[],
    models?: INeoModel[], 
    middlewares?: Handler[], //For now soon IHttpMiddleware
    listeners?: Constructable<any>[], //for now soon IObservable
    imports?: any[], //soon make transformed packages
}

/**
 * Package is an alternative to a module whereas a module is a
 * bundle of providers/services, here a package is a workspace
 * where you can import/export multiple modules
 * 
 * @package Neo
 */
export interface Package
{
    readonly name: string,
    controllers?: Constructable<any>[],
    configs?: JSON[],
    models?: Constructable<any>[],
    middlewares?: Handler[],
    listeners?: Constructable<any>[],
    imports?: Package[],
}
