/**
 * Implements the creation of a new data type
 * Useful for node modules if you want to load a 
 * module and instantiate him
 * 
 * @package Neo
 */
export interface IConstructable<T>{
    new <T>() : void
}