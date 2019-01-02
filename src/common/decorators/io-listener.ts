import { isUndefined } from 'util';
import { IO_HANDLER, IO_LISTENER } from '../../constants';
/**
 * Defines the Event Listener for socket.io just as a namespace
 * @todo Make this receive a interface object in order to have multiple options
 * @param name 
 */
export function EventListener (data?: IListenerDescription) : ClassDecorator {
    const nData = isUndefined(data) ? null : data
    return (target: object) => {
        Reflect.defineMetadata(IO_LISTENER, nData, target)
    }
}

/**
 * Defines a bind for an event after a connection being established
 */
export function SubscribeEvent (eventName: string) : MethodDecorator {
    return (target: object, key, descriptor) => {
        Reflect.defineMetadata(IO_HANDLER, eventName, descriptor.value)
        return descriptor
    }
}

/**
 * Interface used to define the metadata of a eventlistener 
 * class 
 * 
 * @package Neo
 */
export interface IListenerDescription
{
    /**
     * Defines an alias for runtime
     * this will be implemented soon at Listeners repository
     */
    alias?: string,
    /**
     * Defines a namespace where the socket will wait events
     * @link https://socket.io/docs/rooms-and-namespaces/
     */
    namespace?: string,
    /**
     * Defines whether you want to receive socket.io server through
     * dependecy injection
     * @todo Implement soon this filtering
     * 
     * @default true
     */
    importServer?: boolean,
    //much more
}