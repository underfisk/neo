import 'reflect-metadata';
/**
 * Injectable decorator allows your class to receive
 * throught "Depedency Injection" the autoloaded instances
 *
 * @example Models receive adapter
 * Controllers get models
 * Listeners get socket.io and models
 */
export declare function Injectable(): ClassDecorator;
