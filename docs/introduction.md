# Introduction

* [Architecture](#architecture)
* [Initialize a new Neo project](#initializing-a-new-project)
* [NeoAppConfig](#neoappconfig)
* [Routing](#routing)
* [Controllers](#controllers)
* [Event Listeners](#event-listeners)
* [Middlewares](#middlewares)
* [Models](#models)
* [Views/Whatever](#views/whatever)
* [Models injection loading and unloading](#models-injection-loading-and-unloading)
* [Services](#services)
* [Database](#database.md)
* [Low level API](lowlevelapi.md)


## Architecture
Neo implements it's own architecture which is led by Packages as .NET, java and other languages.
In order to keep code organized in high scalable projects, sometimes you need to "bundle" you're code in parts
to get a more controlable and scalable code.
We use "singleton" pattern to load some resources such as Listeners, Controllers, Models and Services.
This framework may be seen as a "boilerplate" since we simply mount everything in front of express/socketio with 
a few modifications for the "need" in our project.

### Package
A package is something groupable where you can have parts of code inside a box. This is nothing more than a simple way of importing/exporting code.
By default it's required 1 package to be loaded, otherwise Neo Application won't load and throw a MissingPackage exception.

<p align="center">
  <img  src="https://i.imgur.com/o3ng2fw.png">
</p>

### Connecting packages
Sometimes we need in Neo to include other package code or even utilities and by so we provide a way of doing it in runtime and at declaration.
If you want Package A code to be usable inside Package B, Package A has to allow exportation and by setting to true, by default it is true.

What if we are trying a loaded package? No proble, Neo will find it at our Package Repository and will return the reference to the loaded one, otherwise it simply load it.
Warning: This do not apply at getPackage() only at loading!

### Retrieving packages at runtime
Every loaded package is held at our singleton Package Repository where you can get, load and unload a package. 
To retrieve a package you must do:
```typescript
PackageRepository.getPackage("name or leave blank for first package")
```
If the package is found you can access directly or via variable reference to your retrieve package models, controllers, configs and listeners.

## Initializing a new project
Modules required:
 - Nodemon (we strongly recommend otherwise you have to edit npm start)
 - Typescript (globaly installed)
 - Node (8x or superior)
 - Neo CLI (Easy interface for files creation)

Neo CLI command:
```
neocli create project-name
```
Without CLI:
Create a folder, initialize your npm and add neo as a dependency

Default folder structure using NeoCLI:
```bash
├── project
│   ├── controllers
│   │   ├── welcome.ts
│   ├── models
│   ├── listeners
|   |   |── main.ts
│   ├── views
|   |   |── index.html
└── .index.ts
```
If you specify the argument pkg it will create a package structure:
```bash
├── project
|   ├── default
│   | ├── controllers
│   │   ├── welcome.ts
│   | ├── models
│   | ├── listeners
|   |   |── main.ts
│   | ├── views
|   |── index.html
└── .index.ts
```

## NeoAppConfig
When we create a new `NeoApplication` we need to provide a default package but also a list of properties which are listed in the interface `NeoAppConfig`.
This is may be considered an auto-loader for the application which means
models, controllers and listeners must be seeded here instead of runtime loading.

[NeoAppConfig More](neoappconfig.md)

## Routing
This technique allow's developers to define the URL(s) paths to handle
client requests in specific HTTP Methods.

[Routing API](routing.md)

## Controllers
As you've seen routing is the way of declaring the URL(s) and available methods for client request.
Controllers are a section of handlers that will resolve new requests and respond to them.

[Controllers API](controllers.md)


## Event Listeners
We use Socket.io as our main websockets/polling library to provide realtime features. You can disable/enable it at default application configuration and also inject middlewares for socket.io.
By default it's being loaded and express-session is being shared with socket.io if you enable session and provide the necessary configuation.

[EventListeners API](event-listeners.md)

## Middlewares
Neo offers 3 type of middlewares such as:
 * Controllers 
 * Namespace
 * Event

Controllers middlewares are declare above the method decorator by injecting a Express.NextFunction that will be called before the route being reached.
This is very useful when you wanna validate some body field or for security reasons.

Example of a controller for get parameter in default prefix:
```typescript
@Middleware([(req,res,next) => {
    console.log('Hi')
    next()
}])
@Get('hello')
public async onHello(req,res) : Promise<any> {
    res.json({message: 'hello'})
}
```
Namespace middlewares are declared above the class decorator of an EventListener class which is the group of socket.io handlers. 
By default '/' is the equivalent to io default namespace
Now if you specify the namespace then it will set the middleware to act
on that group.
For good practises never set a middleware for a different group of the current group you're working on.
Read more at: https://socket.io/docs/rooms-and-namespaces/

Example of a EventListener using Namespace Middleware:
```typescript
@NamespaceMiddleware()
@EventListener()
class MainListener
{
    constructor(){}
    ...
}
```

Event middleware are the socket.io event middleware equivalent, where our middleware are directly calling upon socket.io use function.
Read more at: https://socket.io/docs/server-api/

Example of an event middleware:

```typescript
@EventMiddleware( (socket, packet, next) => {
    console.log('Hi')
    next()
})
@SubscribeEvent('on-whatever')
public onWhateverHandler(socket, data) => {

}
```

## Models
In Neo, models are actually equal to MVC architecture models, there are no differences except that in Neo we provide a way of injecting models through constructor (Dependecy injection pattern) or manually from Package Repository.
Also every model receive the database adapter via (DI) if you provide a database adapter or speficy a built-in one.
In theory, Models are the entities that work with database/data itself and do not handle routing or event-driven calls.

Example of a NeoModel:
```typescript
@Model()
class WhateverModel
{
    constructor(private readonly adapter: typeOfIt){
        ...
    }
    ...
}
```
Read more at : [Models](#models.md)

## Views/Whatever
Angular has introduced whatever has an alternative of containing stricted html pages because Angular works by modules and extended html tags to work with js in a more flexible way.
Now, Neo is able to provide such thing here by allowing the developer choosing between render a view page with express or even serve React,Vue,etc builds to the client.

We'll have soon, built-in features to stream React code and automaticly compile and serve using webpack and the provided config.

## Models injection, loading and unloading
As mentioned Neo implements MVC as the main pattern in front of express.
Controllers and EventListeners are the only group of handlers that work directly with data so both of them may receive via injection a `ModelRepository` which is a list of the loaded models.

In order to load a new model we simply have to retrieve the package and load it there, the same goes to unload.


## Services
Neo uses a different philosophy for Services whereas in Angular/Nest they are a part of providers.
Here we provide built-in services as MVC helpers such as Email Service, Form validation, Session state container and much more things that will offer excelent features.

In order to load/get a service you need to access the app singleton
```typescript
NeoApplication.singleton.getService<Type is optional for cast>("name")
```


## PackageRepository API

#### createPackage(name: `string`)
Creates a default package and returns the new package

#### getPackage(nameOrAlias: `string`)
Returns the package is found by the provided class name or alias

### isLoaded(nameOrAlias: `string`)
Returns whether a package is loaded or not

## Package API

#### loadModel<Type>(model: `INeoModel`)
Loads a model if it isn't loaded and returns the reference of the loaded model or the new loaded model.

#### loadController<Type>(controller: `IConstructable<Type>`)
Loads a new controller which accepts a node module function and returns the reference. In case it's already loaded, it returns the loaded instance reference.

#### loadListener<Type>(listener: `IConstructable<Type>`)
Loads a new controller which accepts a node module function and returns the reference. In case it's already loaded, it returns the loaded instance reference.

#### getName() : `string`
Returns the package name

#### getModel<Type>(nameOrAlias: `string`)
Retrieves a model in case it's loaded and returns the model casted for the provided type.

#### getLoadedModels()
Returns the list of loaded models

#### getLoadedControllers()
Returns the list of loaded controllers

#### getLoadedListeners()
Returns the list of loaded listeners
