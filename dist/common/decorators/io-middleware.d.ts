/// <reference types="socket.io" />
import 'reflect-metadata';
/**
 * EventMiddleware is mentioned for socket.io handlers and it's called
 * before the socket event being fired and when the data packet arrives
 *
 * @package Neo
 */
export declare function EventMiddleware(fn: (socket: SocketIO.Socket, packet: SocketIO.Packet, next: (err?: any) => void) => void): MethodDecorator;
/**
 * Registers a new middleware to be used in the namespace
 *
 */
export declare function NamespaceMiddleware(namespace: string, fn: (socket: SocketIO.Socket, next: any) => void): ClassDecorator;
