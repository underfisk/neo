/**
 * Logger service to provide debugging on Neo Application
 * @package Neo
 */
export declare class Logger {
    /**
     * Private instance of debug
     */
    private static readonly logInstance;
    /**
     * Logs a given message
     * @param str
     */
    static log(str: any): void;
    /**
     * Wars a message
     * @param str
     */
    static warn(str: any): void;
    /**
     * Returns a stack as an error
     * @param str
     */
    static error(str: any): void;
    /**
     * Returns today date formatted
     */
    private static todayDate;
}
