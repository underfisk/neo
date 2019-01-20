/**
 * Throws a RoutingError error
 * 
 * @package Neo
 */
export class RoutingError extends Error {
    constructor(public message: string){
        super(message)
        this.name = "Routing Error"
        this.stack = (<any> new Error()).stack;
    }
}