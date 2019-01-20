import { INJECTABLE_OBJECT } from '../../constants'
import 'reflect-metadata'
/**
 * Injectable decorator allows your class to receive
 * throught "Depedency Injection" the autoloaded instances
 * 
 * @example Models receive adapter
 * Controllers get models
 * Listeners get socket.io and models
 */
export function Injectable () : ClassDecorator {
    return (target: object) => {
        Reflect.defineMetadata(INJECTABLE_OBJECT, true, target)
    }
}