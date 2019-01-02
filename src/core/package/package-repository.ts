import { Repository } from './repository';
import { isUndefined } from 'util';

/**
 * Singleton of loaded packages in case the package decide to be global
 * @todo Make that part of be global
 * 
 * @package Neo
 * @author Rodrigo Rodrigues
 */
export class PackageRepository
{
    /**
     * Holds reference to transformed packages
     */
    private static loadedPackages: Repository[] = []
 
    /**
     * Creates a default package
     * @param name 
     */
    public static createPackage(name: string) : Repository
    {
        if (PackageRepository.isLoaded(name))
            throw new Error(`${name} package is already loaded.`)
        else
        {
            let pkg = new Repository({
                name: name,
                configs: [],
                controllers: [],
                models: [],
                listeners: [],
                middlewares: [],
                imports: []
            })
            PackageRepository.loadedPackages.push(pkg)
            return pkg
        }
    }

    /**
     * Retrieves a package
     * @param nameOrAlias 
     */
    public static getPackage(nameOrAlias?: string) : Repository {
        if (isUndefined(nameOrAlias)) return this.loadedPackages[0]
        else
        {
            for(const repo of this.loadedPackages)
                if (repo.getName() === nameOrAlias) return repo
        }
    }

    /**
     * Returns whether a package is already loaded or not by it's name
     * @param name 
     */
    public static isLoaded(name: string) : boolean {
        for(const pkg of PackageRepository.loadedPackages)    
            if (pkg.getName() === name) return true

        return false
    }
}