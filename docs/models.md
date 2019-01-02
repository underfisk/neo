# Models

* [Getting started](#getting-started)
* [Adapters](#adapters)
* [References](#references)


## Getting started
Model represents domain specific data and business logic in MVC pattern. 
It maintains the data of the application. Model objects retrieve and store model state in the persistance store like a database.

Model class holds data in public properties. All the Model classes reside in the Model folder in MVC folder structure with also the file name convention of `modelName.model.ts`.

### Differences in Neo
In Neo, models are injected with the default provided `Adapter` such as `MysqlApter` that provides a list of functions like `query`.

### Defining the adapter
**Note:** Every listed option below has a property in NeoAppConfig
**Warning**: You can only have one loaded configuration!

 * Mysql: In order to load mysql configuration, you have to provide `mysqlOptions` property of type `mysql.PoolConfig`. 
    Example: ```
    host : "",
    database: "name",
    user: "root",
    password: "",
    port: 3306,
    charset: 'utf8mb4_bin'```
* TypeORM: In order to load typeORM configuration, you have to provide `ormOptions` property of type `ConnectionOptions` from `TypeORM` npm module.
 Check TypeORM documentation to know the available options.


### Example of a model
```typescript
imports..
@Model()
class HelloWorld {
    constructor(private readonly adapter: any, ...) {...}
}
```

## Adapters
The available interfaces for database adapters are:
 * `MysqlAdapter`
 * `OrmAdapter`
 * soon more


## References
#### Model (options: `IModelOptions`)
- `alias?: String` Alias for this model, default is class name
- `modelsInjection?: Boolean` Whether you want to receive `ModelRepository`
- `isGlobal: Boolean` Whether this model is available for other packages
- default: `{ modelsInjection: true, isGlobal: true }`

Marks a class as a Model by receiving the database adapter injected and also defines some metadata for the runtime checking.

#### query(sql: `string`, params: `any[]`)
Every adapter except TypeORM provides query function to execute raw sql queries. Each of them are implemented according to the npm module we're using.
TypeORM provides getConnection() method which returns the open connection and provide query method.


