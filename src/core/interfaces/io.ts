/**
 * Temporary here
 * Used to create boot socketio middelware loading
 */
export interface IoMiddleware {
    (socket: SocketIO.Socket, next: any) : void
}
/**
 * Provides an easy way for reading/writing new socket responses
 * This is an optional interface
 */
export interface IEventData {
    data: any,
    type: string
}