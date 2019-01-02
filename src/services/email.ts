import * as nodemailer from 'nodemailer'
import { MailOptions } from 'nodemailer/lib/smtp-transport';
import * as debug from 'debug'
import { Logger } from '../common';
import { IEmailHtml } from './interfaces';

const log = debug('app:email-service')

/**
 * Email service provided by Neo
 */
export default class EmailService
{
    // create reusable transport method (opens pool of SMTP connections)
    private smtpTransport: nodemailer.Transporter

    constructor(private readonly config: nodemailer.TransportOptions){
        this.smtpTransport = nodemailer.createTransport(this.config)
        log("Created a new SMTP Transport")
    }
    
    /**
     * Sends an email
     * @param message MailOptions
     */
    public async send(message: MailOptions) : Promise<any> {
        return new Promise<any>( (resolve, reject) => {
            this.smtpTransport.sendMail(message, (error: Error, info: any) => {
                if (error)
                {
                    log("SMTP Email Error: " + error )
                    reject(error)
                }
                else
                    resolve(info)
            })
        })
    }

    /**
     * Sends a html email
     * @param data 
     */
    public async sendHtml(data: IEmailHtml) : Promise<any> {
        return new Promise( async (resolve, reject) => {
            await this.send(data)
                .catch(err => {
                    Logger.log(err)
                    reject(false)
                })
                .then( data => {
                    resolve(true)
                })
        })
    }
}



