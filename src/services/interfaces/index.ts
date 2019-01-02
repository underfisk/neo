import { Address } from "nodemailer/lib/mailer";

/**
 * Interface to establish a pattern to 
 */
export interface IEmailHtml
{
    from: string | Address,
    to: string | Address,
    subject: string,
    html: string
}