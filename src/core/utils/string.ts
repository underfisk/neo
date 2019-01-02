/**
 * Tricky shortcut for string empty
 */
export enum String {
    Empty = ""
}

/**
 * Verifies whether a string is null or white space
 * 
 * @param str 
 * 
 * @return boolean
 */
export function isNullOrWhiteSpace (str: string) : boolean {
    if (str === "" || str === null) return true
    return false
}