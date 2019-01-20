/**
 * Interface for Routes metadata
 */
export interface IRouteMetadata {
    path: string,
    methods: string[],
    handler: Function
}