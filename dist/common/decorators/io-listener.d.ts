import 'reflect-metadata';
/**
 * Defines the Event Listener for socket.io just as a namespace
 * @todo Make this receive a interface object in order to have multiple options
 * @param name
 */
export declare function EventListener(data?: IListenerDescription): ClassDecorator;
/**
 * Defines a bind for an event after a connection being established
 */
export declare function SubscribeEvent(eventName: string): MethodDecorator;
/**
 * Interface used to define the metadata of a eventlistener
 * class
 *
 * @package Neo
 */
export interface IListenerDescription {
    /**
     * Defines an alias for runtime
     * this will be implemented soon at Listeners repository
     */
    alias?: string;
    /**
     * Defines a namespace where the socket will wait events
     * @link https://socket.io/docs/rooms-and-namespaces/
     */
    namespace?: string;
    /**
     * Defines whether you want to receive socket.io server through
     * dependecy injection
     * @todo Implement soon this filtering
     *
     * @default true
     */
    importServer?: boolean;
}
