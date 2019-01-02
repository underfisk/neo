import { NEO_MVC_MODEL } from "../../constants";
import { Constructable } from '../collections/constructable';
import { IModelOptions } from "./interfaces";
import { isUndefined } from "util";
import { isNullOrWhiteSpace } from "../../core/utils";

/**
 * Model is a way of provide information seeding to your controllers/listeners
 * Neo uses MVW technique to provide models being injected into controllers or
 * listeners
 * WARNING: Do not repeat alias names otherwise it will return an unexpected reference
 * @param options 
 */
export function Model (options?: IModelOptions) : ClassDecorator {
    return (target: object) => {
        let _options: IModelOptions = {}
        if (!isUndefined(options)) //Read it
        {
            if (isNullOrWhiteSpace(options.alias))
                throw new Error(`Please do not provide ${options.alias} as the name for ${target['name']}`)
                
            _options = {
                alias: options.alias  || target['name'],
                isGlobal: options.isGlobal || true,
                modelsInjection: options.modelsInjection || false
            }
        }
        else //default
            _options = {
                alias: target['name'],
                isGlobal: true,
                modelsInjection: false
            }

        //Define it
        Reflect.defineMetadata(NEO_MVC_MODEL, _options , target )
    }
}

