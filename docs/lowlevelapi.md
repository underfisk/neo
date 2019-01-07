# Low level API

* [Accessing Express](#accessing-express)
* [Accessing Socket.io](#accessing-socketio)


## Accessing Express
In order to access to express, after you create your APP you'll be able to access it directly by doing:
```typescript
const app = new NeoApplication(pkg,config)
//express instance
app.httpServer.whateverOfExpress
```
but also you can access it via the singleton:
```typescript
const app = new NeoApplication(pkg, config)
//in a new file or in the same..
NeoApplication.singleton.httpServer.whatever
```
**Note:** Make sure you access all this properties after app.start()

### Accessing SocketIO
Our main choice was socket.io because it is indeed a great library which provides an easy integration. Therefore the community has developed alot of middlewares, features and some frameworks in front of it.
We allow you do to whatever you want too with socket.io but the risk will be yours to take since we don't know what you'll be doing outside the decorators metadata.

You can access it after app instance being created:
```typescript
const app = new NeoApplication(pkg,config)
//socketio instance
app.io.whateverOfSocketIO
```
and also you can access it via the singleton:
```typescript
const app = new NeoApplication(pkg,config)
//same file or different
NeoApplication.singleton.io
```

**Note:** Make sure you access all this properties after app.start()

