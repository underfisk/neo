import * as neots from '../src'
import * as mysql from 'mysql'
import { MysqlAdapter } from '../src/database'
import CatModel from './cat.model';
import SmtpEmailer from './smtp';
import CatController from './cat.controller';
import CatListener from './cat.listener';

//works
const unafeInstance = mysql.createPool({
    host: "localhost",
    user: "root",
    database: 'top'
})

//safe db
const safeDB = new MysqlAdapter({
    host: "localhost",
    user: "root",
    password: "",
    database: 'top'
})

async function boostrap() {
    const app = new neots.NeoApplication({
        name: "test",
        port: 4000,
        //unsafeDatabase: unafeInstance
        database: safeDB,
        services: [
            {name: "email", instance: new SmtpEmailer()}
        ],
        socketOptions: {
            transports: ['polling'],
            allowUpgrades: false
        },
        controllers: [ CatController],
        listeners: [ CatListener ]
    })
    
    app.start(() => {
        console.log("App has started")
    })
}

boostrap()