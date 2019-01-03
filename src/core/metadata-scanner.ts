/**
 * MetadaScanner is a reflection utility to gather information of node modules/function parsed
 * given to be loaded
 * 
 * @author Enigma
 * @package Neo
 */
export class MetadataScanner
{
    /**
     * Scans for metadata with the given property
     * @param obj 
     * @param property 
     */
    public static scan<T, Y>(obj: T, property: string) : any {
        let methods = []
        Object.getOwnPropertyNames(obj).forEach((name) => {
            if (typeof obj[name] === 'function' && name !== 'constructor') {
                let methodDescriptor = Reflect.getMetadata(property, obj[name])
                //Is the reference not undefined? save it
                if (methodDescriptor !== undefined)
                    methods.push( {
                        descriptor: <Y>methodDescriptor,
                        method: obj[name]
                    })
            }
        })
        return methods
    }

    /**
     * Returns the class metadata if it founds
     * @param obj 
     * @param property 
     */
    public static scanClass<T> (obj: any, property: string) : T {
        return <T>Reflect.getMetadata(property, obj)
    }
}