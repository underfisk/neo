# Neo Application Config

* [Getting started](#getting-started)
* [Batteries](#batteries)
* [References](#references)


## Getting started
As you know every application need base data to rely on which means you need to provide initial data in Neo in order to boot features (externally or internally).
Neo offers a way of loading the configurations by priority layer:
- Express will be always first due to http server creation
- SocketIO is right after express
- Finally comes Neo where boots the provided app configuration

### Batteries
This technique is very used at this moment in web applications and you can take a look at Django.
We are quite a "battery-included" framework but since we are in a continuous development we need to keep track of what we load.

Soon the default batteries will be splited into multiple modules in order to speed up the "core".

## References
#### Properties:
* name?: string  Application name
**Note:** You can only have 1 adapter provided, soon this will change
* sessionOptions?: express-session.SessionOptions  Whether you want to use express-session middleware just simply provide information
* sslOptions?: https.ServerOptions Information about public/private cert
* hostname?: string Server address, default is localhost
* port: number Server port
* viewEngine?: string Express response view engine, default is ejs
* middlewares?: IExpressMiddleware[]  Express middlewares for http server(they are loaded before router and applied for the routes also)
* databaseORM?: TypeORM.ConnectionOptions Provide TypeORM information in order to enable it. Soon we'll have more alternatives
* trustProxy?: boolean Enables express trust proxy option, **recommended** if you are using Nginx or some proxy
* corsOptions?: express-cors.CorsOptions  Provides express-cors module configuration in order to load CORS at express
* helmetOptions?: boolean | helmet.IHelmetConfiguration  Enable/Disable helmet or provide configuration options which enables. By default we enforce helmet
