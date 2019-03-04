import { IModelOptions } from "./interfaces";
import 'reflect-metadata';
/**
 * Model is a way of provide information seeding to your controllers/listeners
 * Neo uses MVW technique to provide models being injected into controllers or
 * listeners
 * WARNING: Do not repeat alias names otherwise it will return an unexpected reference
 * @param options
 */
export declare function Model(options?: IModelOptions): ClassDecorator;
