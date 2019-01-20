import { Handler } from 'express';
import { Constructable } from '../../common/constructable'


/**
 * Package is an alternative to a module whereas a module is a
 * bundle of providers/services, here a package is a workspace
 * where you can import/export multiple modules
 * 
 * @package Neo
 */
// export interface IPackage {
//     readonly name: string,
//     controllers?: Constructable<any>[],
//     models?: Constructable<any>[],
//     middlewares?: Handler[],
//     listeners?: Constructable<any>[]
// }
