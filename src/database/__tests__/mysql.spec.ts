import { MysqlAdapter } from '..'
import 'mocha'
import * as chai from 'chai'
import * as dotenv from 'dotenv'
dotenv.config()

const expect = chai.expect

let adapter = null

describe('Mysql adapter tests', () => {
    it('should connect to the server with .env config', done => {
        adapter = new MysqlAdapter({
            host: process.env.MYSQL_HOST || "",
            user: process.env.MYSQL_USER || "",
            password: process.env.MYSQL_PASSWORD || "",
            port: parseInt(process.env.MYSQL_PORT) || 3306,
            database: process.env.MYSQL_DATABASE || ""
        })
        done()
    })

    it('should perform a query without problems', done => {
        adapter.query('SELECT version()')
            .catch(done)
            .then( res => {
                expect(res).not.to.be.undefined
                done()
            })
    })

    it('should close the database and dispose', done => {
        adapter.close(err => {
            expect(err).to.be.undefined
            done()
        })
    })
})