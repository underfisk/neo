/// <reference types="socket.io" />
import { Router } from 'express';
import { Repository } from './repository';
import { NeoAppConfig } from './interfaces';
/**
 * Repository Factory is designed to process, analyze and load
 * our application resources such as Controllers, Listeners
 * and Models
 *
 * @author Enigma
 * @package Neo
 */
export declare class RepositoryFactory {
    /**
     * Processes a given package
     *
     * @param pkg
     *
     * @return returns whether he was
     * loaded succesfully or throw error
     */
    static load(config: NeoAppConfig, repoRef: Repository, router: Router, io: SocketIO.Server): any;
    /**
     * Loads the controllers of a given package
     * @param pkg
     */
    private static loadControllers;
    /**
     * Loads the models of a given package
     *
     * @private
     * @param {Package} pkg
     * @memberof PackageFactory
     */
    private static loadModels;
    /**
     * Loads all the routes for express
     * @param pkg
     */
    private static loadRoutes;
    /**
     * Load all the listeners
     *
     * @private
     * @param {Package} pkg
     * @returns {Listener[]}
     * @memberof PackageFactory
     */
    private static loadListeners;
    /**
     * Receives the prefix of controller and the path of the route
     * and escapes/explore it
     *
     * @param route
     */
    private static routeFormatter;
}
