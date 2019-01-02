# Controllers

* [Getting started](#getting-started)
* [Routing](routing.md)
* [Good practises](#good-practises)
* [References](#references)


## Getting started
Controllers are responsible to hold a list of functions that will handle URL paths (Request handlers).
For example, when a route metadata is defined above the function, Neo will load that object information and seed express about this function.

### Differences in Neo
In Neo, controllers are implemented like in MVC Pattern but you additionally receive via depedency injection a `ModelRepository` which contains the list of loaded models. This may be enabled/disabled at controller initial metadata.

### Example of a controller
```typescript
imports..
@Controller()
class HelloWorld {
    constructor(...) {...}
}
```

## Good practises
MVC stands for Model-View-Controller we need to establish rules for the 3 different groups.
- Models simply work around with the data, usually the external stored data such as Databases. You should never call a controller or directly render to the client from models.
- Views in express are not only files, a view may be rendered as a text or even as a build file. Views never include object references from server nor exposable configuration information.
- Controllers in the other handle are simply a group of functions which handle individually a route with user request. You can imagine controller as the top level element, where controller may gain access for `Models` and `Views` but neither of those 2 should call a `Controller`

## References

#### Controller (data: `IControllerData`)
- `name: String` Prefix of this controller
- `modelsInjection: Boolean` Whether you want to receive `ModelRepository`
- default: `{ name: '/', modelsInjection: true }`

Defines the prefix of this controller
Example: www.yourdomain.com/cats/ will have cats as the controller and a route function to handle the `/` path.
