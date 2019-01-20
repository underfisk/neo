import * as neo from '../src'
import * as mysql from 'mysql'
import { MysqlAdapter } from '../src/database'
import { Logger, NeoApplication } from '../src';
import SmtpEmailer from './smtp';

@neo.Model({
    alias: 'cat'
})
export default class CatModel {
    constructor(private readonly db: MysqlAdapter) {
        this.getVersion()
        const e = NeoApplication.singleton.getService<SmtpEmailer>('email')
        e.hello()
    }

    public getVersion() : any {
        this.db.query("SELECT version()").then( r => {
            console.log(r)
        })
        .catch(er => {
            throw er
        })
    }
}