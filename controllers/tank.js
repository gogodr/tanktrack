const Boom = require('boom');
const { getTankValidator,
    getTankSettingsValidator,
    getTankWorkValidator,
    postTankReportValidator,
    postTankWorkValidator,
    addTankValidator } = require('../validators/tank');
const TankInteractor = require('../interactors/tank');

class TankController {
    constructor(server, models, mailgun) {
        this.server = server;
        this.models = models;
        this.mailgun = mailgun;
        this.interactor = new TankInteractor(this.models, this.mailgun);
    }

    initialize() {
        console.log('Register: GET /tank/{id}');
        this.server.route({
            method: 'GET',
            path: '/tank/{id}',
            handler: async (request, reply) => {
                const params = {
                    id: request.params.id
                };
                const validRequest = getTankValidator(params);
                if (validRequest.error) {
                    throw Boom.badRequest('Invalid Query', validRequest.error);
                }
                const tank = await this.interactor.getTank(params);
                return tank;
            }
        });

        console.log('Register: GET /tank/{id}/settings');
        this.server.route({
            method: 'GET',
            path: '/tank/{id}/settings',
            handler: async (request, reply) => {
                const params = {
                    id: request.params.id
                };
                const validRequest = getTankSettingsValidator(params);
                if (validRequest.error) {
                    throw Boom.badRequest('Invalid Query', validRequest.error);
                }
                const settings = await this.interactor.getTankSettings(params);
                return settings;
            }
        });
        console.log('Register: GET /tank/{id}/work');
        this.server.route({
            method: 'GET',
            path: '/tank/{id}/work',
            handler: async (request, reply) => {
                const params = {
                    id: request.params.id
                };
                const validRequest = getTankWorkValidator(params);
                if (validRequest.error) {
                    throw Boom.badRequest('Invalid Query', validRequest.error);
                }
                const work = await this.interactor.getTankWork(params);
                return { work };
            }
        });
        console.log('Register: POST /tank/{id}/work');
        this.server.route({
            method: 'POST',
            path: '/tank/{id}/work',
            handler: async (request, reply) => {
                const params = {
                    id: request.params.id
                };
                const validRequest = postTankWorkValidator(params);
                if (validRequest.error) {
                    throw Boom.badRequest('Invalid Query', validRequest.error);
                }
                const tank = await this.interactor.postTankWork(params);
                return tank;
            }
        });
        console.log('Register: POST /tank/{id}/report');
        this.server.route({
            method: 'POST',
            path: '/tank/{id}/report',
            handler: async (request, reply) => {
                const params = {
                    id: request.params.id,
                    report: request.payload.report
                };
                const validRequest = postTankReportValidator(params);
                if (validRequest.error) {
                    throw Boom.badRequest('Invalid Query', validRequest.error);
                }
                const tank = await this.interactor.postTankReport(params);
                return tank;
            }
        });

        console.log('Register: POST /business-unit-location/{businessUnitLocationId}/tank');
        this.server.route({
            method: 'POST',
            path: '/business-unit-location/{businessUnitLocationId}/tank',
            handler: async (request, reply) => {
                const params = {
                    businessUnitLocationId: request.params.businessUnitLocationId,
                    name: request.payload.name
                };
                const validRequest = addTankValidator(params);
                if (validRequest.error) {
                    throw Boom.badRequest('Invalid Query', validRequest.error);
                }
                const tank = await this.interactor.addTank(params);
                return tank;
            }
        });
    }

    sendTankOfflineMail(tank_id) {
        console.log('send mail, controller', tank_id);
        this.interactor.sendTankOfflineMail(tank_id);
    }

    async getOfflineTanks() {
        return await this.interactor.getOfflineTanks();
    }
}

module.exports = TankController