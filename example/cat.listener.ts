import { EventListener } from "../src";
import { SubscribeEvent } from '../src/common/decorators/io-listener';
import { IEventData } from '../src/core/interfaces/io';
import { NamespaceMiddleware } from '../src/common/decorators/io-middleware';
import { catListMiddleware } from "./middleware";

@NamespaceMiddleware('/', catListMiddleware)
@EventListener()
export default class CatListener {
    constructor(private readonly io: SocketIO.Server) {
        console.log("Cat listener has been called")
    }

    @SubscribeEvent('on-test')
    public onEventTest(socket: SocketIO.Socket, req: IEventData): void {
        console.log("yea")
        socket.emit('test-reply', {msg: 'hello there'})
    }
}