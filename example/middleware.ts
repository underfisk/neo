import { NeoResources } from '../src/core/neo-resources';
export function catListMiddleware(s: SocketIO.Socket,n: any) : void {
    console.log(NeoResources.singleton)
    console.log("CatList midd")
}