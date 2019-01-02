import { IValuePair } from './valuepair';

/**
 * 
 */
export class Dictionary <TKey, TValue>
{
    /**
     * Private object array
     * 
     * @var T
     */
    private _dictionary: IValuePair<TKey,TValue> [] = []

    /**
     * We'll have more, where you can send the elements,
     * make a blank list or more options
     */
    constructor() {
        
    }

    /**
     * The object to be added to the end of the List<T>. The value can be null for reference types.
     * 
     * @param item T
     * 
     * @return void 
     */
    public Add (key: TKey, value: TValue) : void {
        if (this.ContainsKey(key))
            throw 'ArgumentException to be done soon'

        this._dictionary.push({
            key: key,
            value: value
        })    
    }

    /**
     * Determines whether the Dictionary<TKey,TValue> contains the specified key.
     * @param key TKey
     * 
     * @return boolean
     */
    public ContainsKey (key: TKey) : boolean {
        //for(let [key,value] of Object.entries(this._dictionary))
          //  if (key === key) return true

        return false
    }

    
    /**
     * Returns the count of elements inside
     * 
     * @return int
     */
    public get Count () : number {
        return this._dictionary.length
    }

    FindOne () {

    }

    FindLast () {

    }

    FindFirst () {

    }

    Find () {

    }

    public GetKeys() : TKey[] {
       // console.log(Object.entries(this._dictionary))
        return []
    }

    Remove () {

    }

}