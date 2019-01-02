/**
 * 
 */
export class List <T>
{
    /**
     * Private object array
     * 
     * @var T
     */
    private _list : T[] = []

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
    public Add (item: T) : void {
        this._list.push(item)    
    }

    /**
     * Determines whether the List<T> contains elements that match the conditions defined by the specified predicate.
     * 
     * @param match T
     * 
     * @return boolean
     */
    public Exists (match: T) : boolean {
        if (typeof match == 'undefined' || match == null)
            return false
        
        for(let ele in this._list)
        {
            if (this._list.hasOwnProperty(ele) && this._list[ele] === match)
                return true
        }

        return false
    }
    
    /**
     * Returns the count of elements inside
     * 
     * @return int
     */
    public get Count () : number {
        return this._list.length
    }

    FindOne () {

    }

    FindLast () {

    }

    FindFirst () {

    }

    Find() {

    }

    Remove () {

    }

}