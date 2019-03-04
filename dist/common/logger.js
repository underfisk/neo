"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const chalk = require("chalk");
/**
 * Logger service to provide debugging on Neo Application
 * @package Neo
 */
class Logger {
    /**
     * Logs a given message
     * @param str
     */
    static log(str) {
        if (str === 'object') {
            this.logInstance(JSON.stringify(str));
            return;
        }
        this.logInstance(`[${Logger.todayDate()}] ${chalk.default.yellow("NEO")} ${str}`);
    }
    /**
     * Wars a message
     * @param str
     */
    static warn(str) {
        this.logInstance(`[${Logger.todayDate()}] ${chalk.default.yellowBright('NEO')} ${chalk.default.yellow(str)}`);
    }
    /**
     * Returns a stack as an error
     * @param str
     */
    static error(str) {
        console.log("ERROR: " + str === 'object' ? JSON.stringify(str) : str);
        //console.trace(str)
    }
    /**
     * Returns today date formatted
     */
    static todayDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return `${yyyy}-${mm}-${dd}`;
    }
}
/**
 * Private instance of debug
 */
Logger.logInstance = debug('neots:log');
exports.Logger = Logger;
