# Routing

* [Getting started](#getting-started)
* [Middlewares](#routing)
* [Security](#security)
* [References](#references)


## Getting started
### Route
Route defines the URL pattern and handler information. All the configured routes of an application stored in Express Router directly and will be used by Routing engine to determine appropriate handler class or file for an incoming request.
Express Reference: https://expressjs.com/en/guide/routing.html

### Differences in Neo
Neo routes are declared the same way of express in our low-level api but the major difference is how the middlewares are implemented and some other conventions.
Our main concept is Depedency Injection as Angular, ASP.NET, and more frameworks use in order to retrieve some additional data or even handle the incoming.

### How to declare a route
A route is simply builded via typescript experimental decorators which means we have to provide a method above the function handler in order to be a "real" route.
Check the api below to see how it works

### Example of route definition
In order to create a new route we need a controller because routes are defined inside a controller otherwise an exception is throwed.

```typescript
imports..
@Controller()
class HelloWorld {
    constructor(...) {...}
    
    @Get()
    public root(req: Express.Request, res: Express.Response) : any {
        //your code here
        ...
    }

    /**
     * Declaring an route
     * url = yourweb.com/auth
     * where / is the controller prefix
     */
    @Post('auth')
    public authHandler(req: Express.Request, res: Express.Response) : any {
        //your code
        ...
    }
}
```

## Middlewares
Sometimes we need to make some action to ensure some behaviour before the destination be called.
We're using express middlewares behind the scenes which make it easier to find resources or examples of it.


### Example
In this case we will use local class function as the reference but you can implement imported ones or foward declaration.
```typescript
imports ..
class HelloWorld {
    constructor(...) {...}

    @Middleware(this.validateLogin)
    @Post('auth')
    public onAuthRequest(req: Express.Request, res: Express.Response) : any {
        //do whatever
    }

    //Async example
    @Post('auth')
    public async onAuthRequest(req: Express.Request, 
        res: Express.Response) : Promise<any> {
        //whatever u want
    }

    public validateLogin(req: Express.Request, 
        res: Express.Response, next: Express.NextFunction) : any {
        //whatever
        next() //call to continue execution
    }
}
```

## Security
MVC implements a good way of creating structure web applications and sometimes developers mix up some concepts which are anti-pattern.
For example, sometimes you need to gain access to the code made in another controller and it's easier to simple import the controller and load the function. That is a wrong thing to do and when that necessity comes up we re-use code by simple creating a helper function.
Neo uses directly Express Router which implements every behaviour that express has established for routing. Also we load default modules recommended from express maintainers such as Helmet to disable some unnecessary headers.


## References

**Note:** Neo allows multiple methods for a single function handler

#### Get (path: String)
- default: `/`

Defines the path to handle the following HTTP GET Request

### Post (path: string)
- default: `/`

Defines the path to handle the following HTTP POST Request

### Put (path: string)
- default: `/`

Defines the path to handle the following HTTP PUT Request

### Delete (path: string)
- default: `/`

Defines the path to handle the following HTTP DELETE Request

### Options (path: string)
- default: `/`

Defines the path to handle the following HTTP OPTIONS Request

### All (path: string)
- default: `/`

Defines the path to handle the all available HTTP Methods

### Head (path: string)
- default: `/`

Defines the path to handle the following HTTP HEAD Request

### Patch (path: string)
- default: `/`

Defines the path to handle the following HTTP PATCH Request

### Middleware (fn: Express.Middleware)
- fn (req,res,next) : any

Function triggered before the destination handler being called.