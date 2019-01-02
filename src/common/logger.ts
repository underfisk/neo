import * as debug from 'debug';
import * as chalk from 'chalk'

/**
 * Logger service to provide debugging on Neo Application
 * @package Neo
 */
export class Logger
{
    /**
     * Private instance of debug
     */
    private static readonly logInstance = debug('app:logger')
    
    /**
     * Logs a given message
     * @param str 
     */
    public static log(str: any) : void {
        this.logInstance(`[${Logger.todayDate()}] ${chalk.default.yellow("NEO")} ${str}`)
    }

    /**
     * Wars a message
     * @param str 
     */
    public static warn(str: any) : void {
        this.logInstance(`[${Logger.todayDate()}] ${chalk.default.yellowBright('NEO')} ${chalk.default.yellow(str)}`)
    }

    /**
     * Returns a stack as an error
     * @param str 
     */
    public static error(str: any) : void {
        console.trace(str)

    }

    /**
     * Returns today date formatted
     */
    private static todayDate() : string {
        var today = new Date();
        var dd: any = today.getDate();
        var mm: any = today.getMonth()+1; //January is 0!
        
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        return `${yyyy}-${mm}-${dd}`
    }
}