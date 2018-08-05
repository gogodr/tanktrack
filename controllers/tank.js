const Boom = require('Boom');
const { getTankValidator, addTankValidator } = require('../validators/tank');
const TankInteractor = require('../interactors/tank');

class TankController {
    constructor(server, models) {
        this.server = server;
        this.models = models;
        this.interactor = new TankInteractor(this.models);
        this.initialize()
    }

    initialize() {
        console.log('Register: GET /tank/{id}/settings');
        this.server.route({
            method: 'GET',
            path: '/tank/{id}',
            handler: async (request, reply) => {
                const params = {
                    id: request.params.id
                };
                const validRequest = getTankSettingsValidator(params);
                if (validRequest.error) {
                    throw Boom.badRequest('Invalid Query', validRequest.error);
                }
                const tank = await this.interactor.getTankSettings(params);
                return { tank };
            }
        });
        console.log('Register: GET /tank/{id}/work');
        this.server.route({
            method: 'GET',
            path: '/tank/{id}',
            handler: async (request, reply) => {
                const params = {
                    id: request.params.id
                };
                const validRequest = getTankWorkValidator(params);
                if (validRequest.error) {
                    throw Boom.badRequest('Invalid Query', validRequest.error);
                }
                const tank = await this.interactor.getTankWork(params);
                return { tank };
            }
        });
        console.log('Register: POST /tank/{id}/work');
        this.server.route({
            method: 'POST',
            path: '/tank',
            handler: async (request, reply) => {
                const params = {
                    id: request.params.id
                };
                const validRequest = postTankWorkValidator(params);
                if (validRequest.error) {
                    throw Boom.badRequest('Invalid Query', validRequest.error);
                }
                const tank = await this.interactor.postTankWork(params);
                return { tank };
            }
        });
        console.log('Register: POST /tank/{id}/report');
        this.server.route({
            method: 'POST',
            path: '/tank',
            handler: async (request, reply) => {
                const params = {
                    id: request.params.id,
                    report: request.payload.report
                };
                const validRequest = postTankWorkValidator(params);
                if (validRequest.error) {
                    throw Boom.badRequest('Invalid Query', validRequest.error);
                }
                const tank = await this.interactor.postTankWork(params);
                return { tank };
            }
        });

        console.log('Register: POST /business-unit-location/{businessUnitLocationId}/tank');
        this.server.route({
            method: 'POST',
            path: '/tank',
            handler: async (request, reply) => {
                const params = {
                    businessUnitLocationId: request.params.businessUnitLocationId,
                    name: request.payload.name
                };
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