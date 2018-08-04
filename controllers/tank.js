const Boom = require('Boom');
const { getTankValidator, addTankValidator } = require('../validators/tank');
const TankInteractor = require('../interactors/tank');

class TankController {
    constructor(server, models) {
        this.server = server;
        this.models = models;
        this.interactor = TankInteractor(this.models);
        this.initialize()
    }

    initialize() {
        console.log('Register: GET /tank/{id}');
        this.server.route({
            method: 'GET',
            path: '/tank/{id}',
            handler: async (request, reply) => {
                const params = { ...request.params, ...request.payload };
                const validRequest = getTankValidator(params);
                if (validRequest.error) {
                    throw Boom.badRequest('Invalid Query', validRequest.error);
                }
                const tank = await this.interactor.getTank(request.params.id);
                return { tank };
            }
        });

        console.log('Register: POST /business-unit-location/{businessUnitLocationId}/tank');
        this.server.route({
            method: 'POST',
            path: '/tank',
            handler: async (request, reply) => {
                const params = { ...request.params, ...request.payload };
                const validRequest = addTankValidator(params);
                if (validRequest.error) {
                    throw Boom.badRequest('Invalid Query', validRequest.error);
                }
                const tank = await this.interactor.addTank(request.body.payload);
                return { tank };
            }
        });
    }
}

module.exports = TankController