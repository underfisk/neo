import { IO_EVENT_MIDDLEWARE, NAMESPACE_IOMIDDLEWARE } from "../../constants";
import 'reflect-metadata'
/**
 * EventMiddleware is mentioned for socket.io handlers and it's called
 * before the socket event being fired and when the data packet arrives
 * 
 * @package Neo
 */
export function EventMiddleware( fn: ( socket: SocketIO.Socket, 
    packet: SocketIO.Packet, next: (err?: any) => void ) => void 
) : MethodDecorator {
    return (target: object, key, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(IO_EVENT_MIDDLEWARE, fn, descriptor.value)
        return descriptor
    }
}

/**
 * Registers a new middleware to be used in the namespace
 * 
 */
export function NamespaceMiddleware( namespace: string = '/', fn: (socket: SocketIO.Socket, next: any) => void ) : ClassDecorator {
    return (target: object) => {
        Reflect.defineMetadata(NAMESPACE_IOMIDDLEWARE, {
            namespace: namespace,
            handler: fn
        }, target)
    }
}