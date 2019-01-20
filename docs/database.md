# Database

* [Adapter](#adapter)
* [Unsafe Database](unsafe-database)
* [Mysql](#mysql)


## Adapter
Neots offers a battery for databases, which supports SQL and NoSQL.
We only offer support for pool connections not single connections which means
if you wanna just query and close or even getting access to the full database module 
you can simply pass via [Unsafe Database](#unsafe-database)

Every adapter inherits from a ```SqlAdapter``` or ```NoSqlAdapter``` which establish an interface
and common methods.


## Unsafe Database
You can provide ```any``` type of instance you want but you will have to control it and make sure
everything is fine.
By passing unsafe instance, we are not able to protect or control the lifecycle of it.

## Mysql
```typescript
import { MysqlAdapter } from 'neots/database'
const adapter = new MysqlAdapter(mysqlOptions)
```