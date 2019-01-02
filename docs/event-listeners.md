# Event Listeners

* [Getting started](#getting-started)
* [Subscribers](#subscribers)
* [Middlewares](#middlewares)
* [References](#references)


## Getting started
Neo uses socket.io in order to be able to provide "Realtime" features which takes advantage of `Publish/Subscribe` pattern.
Since Neo main concept is implement MVC for typescript using express, we found necessary to use socket.io in order to provide websockets features.
You can read more about at: https://socket.io/docs/

### Event Listener
The philosophy used is the following:
*An event listener has functions which are subscribed to an event in a given namespace.*

Being said, we use this abstraction to provide an organized way instead of having foward event handling declaration. In large scale projects, this can be very messy to work with so we provide a way of preventing that to happen.

**Note:** An event listener is injected always with the io server reference (use this carefully!)

### Event Data
Somethimes filtering the kind of message that comes from client-server or server-client is confused.
In order to keep it clean and simple we provide an interface `IEventData` which has 2 properties:
 * `data: any` Any data you wanna send goes inside this property
 * `type: string` By convention we use request, response, success, error, validation_errors to establish a good way of filtering instead of doing type checking

### Example of a event listener
```typescript
imports..
@EventListener()
class SocketChannel {
    constructor(private readonly io: SocketIO.Server, ...) {...}
}
```

## Subscribers
```typescript
imports ...
@EventListener()
class SocketChannel {
    constructor(private readonly io: SocketIO.Server, ...) {...}
    
    @SubscribeEvent('event-name')
    public onEventName(socket: SocketIO.Socket, data: IEventData) : void {
        //whatever
        socket.emit('event-name-response', {
            data: 123,
            type: 'response'
        })
    }
}
```

## Middlewares
Neo implements middlewares the same way of controller routes with the exact parameters of socket.io middlewares.
You have two kind of middlewares:
 * Namespace
 * Event

**Namespace**: A namespace middleware is a function handler that will be called each time a socket event is called inside a given namespace. Default namespace is `/`.
**Event**: A event middleware is a function handler that will be called before the socket event being reached.

### Example of namespace middleware
```typescript
imports ...

const sayHello = function (socket: SocketIO.Socket, 
    packet: SocketIO.Packet, next: Function) : any {
    //do whatever you want
    next()
}

@NamespaceMiddleware(sayHello)
@EventListener()
class SocketChannel {
    ...
}
```

### Example of event middleware
```typescript
imports ...

const requiredSession = function (socket: SocketIO.Socket, 
    next: Function) : void {
    //hasSession is an abstraction here
    if (!hasSession(socket)) socket.disconnect()
    next() //continue
}

@EventListener()
class SocketChannel {
    constructor(private readonly io: SocketIO.Server, ...) {...}
    
    @EventMiddleware(requiredSession)
    @SubscribeEvent('something')
    public onSomething(socket: SocketIO.Socket, data: IEventData) : any {
        socket.emit('something-response', {
            data: 123,
            type: 'success'
        })
    }
}
```

## References

#### EventListener (data: `IListenerDescription`)
- `alias: String` Alias for reference name in package repository default is the class name
- `namespace: String` Socket.io namespace group default: `/`
- default: `{ namespace: '/' }`

Decorator used to mark a class as an Event Listener.

#### SubscribeEvent (eventName: `string`)
- required

Subscribes to a given event in order to handle the incoming request.

#### NamespaceMiddleware(namespace: `string` , fn: `any`)
- `namespace: string` Socket.io namespace name, default: `/`
- `fn: (socket: SocketIO.Socket, next: any) : void`

Sets a middleware for every time any of the defined events is called to pass first on that provided function.

#### EventMiddleware(fn: `any`)
- `fn: ( socket: SocketIO.Socket, 
    packet: SocketIO.Packet, next: (err?: any) => void ) => void `

Sets a middleware for every time this event is called to pass first on that provided function.