import { Controller, Get } from '../src/'
import { ModelRepository } from '../src/core/model-repository';

@Controller({
    prefix: '/'
})
export default class CatController {
    constructor(models: ModelRepository) {

    }
    
    @Get()
    public alsdalsd(req, res) : void {
        res.sendFile(__dirname + '/index.html')
    }
}