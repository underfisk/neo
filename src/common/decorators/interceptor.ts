import { INTERCEPTABLE } from '../../constants';


/**
 * Interceptor is a middleware object which is allowed
 * to modify the whole class after being instanciated
 * 
 * ** Warning **: Use this very careful in cases like controllers
 * 
 * @example `When our factory creates the `class` instance which
 * is decoratored, interceptor is called with the `class` object to modify
 * and has to `return` a new whole or the same`
 */
export function Interceptor () : ClassDecorator {
    return (target: object) => {
        Reflect.defineMetadata(INTERCEPTABLE, true, target)
    }
}
