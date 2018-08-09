const { Op } = require('sequelize');
const moment = require('moment');

class TankInteractor {
    constructor(models, mailgun) {
        this.models = models;
        this.mailgun = mailgun;
    }
    async addTank(request) {
        const tank = await this.models.tank.create({
            'name': request.name,
            'business_unit_location_id': request.businessUnitLocationId
        });
        let tankSettingsRequest = {
            'tank_id': tank.tank_id,
            'active': true,
            'work': 'OPERATION'
        }
        if (request.schedule) {
            tankSettingsRequest.schedule = request.schedule;
        }
        if (request.dispense_amount) {
            tankSettingsRequest.dispense_amount = request.dispense_amount;
        }
        const tankSettings = await this.models.tank_settings.create(tankSettingsRequest);
        let tank_response = tank.toJSON();
        tank_response.settings = tankSettings.toJSON();
        return tank_response;
    }

    async getTank(request) {
        const tank = await this.models.tank.findOne({
            where: { tank_id: request.id },
            include: [{
                model: this.models.tank_settings,
                as: 'settings'
            }, {
                model: this.models.tank_report,
                as: 'reports',
                required: false,
                where: {
                    createdAt: {
                        [Op.gte]: moment().subtract(3, 'days').toDate()
                    }
                }
            }]
        });
        return tank.toJSON();
    }

    async getTankSettings(request) {
        const tankSettings = await this.models.tank_settings.findOne({
            where: { tank_id: request.id }
        });
        return tankSettings.toJSON();
    }

    async getTankWork(request) {
        const tankSettings = await this.models.tank_settings.findOne({
            where: { tank_id: request.id }
        });
        return tankSettings.work;
    }

    async postTankReport(request) {
        const report = await this.models.tank_report.create({
            tank_id: request.id,
            report: request.report
        });
        if (request.report === 'SUCCESSFUL_DISPENSE') {
            const tank_settings = await this.models.tank_settings.findOne({
                where: { tank_id: request.id }
            });
            tank_settings.last_dispense = new Date();
            await tank_settings.save();
        }
        return report.toJSON();
    }

    async postTankWork(request) {
        const tankSettings = await this.models.tank_settings.findOne({
            where: { tank_id: request.id }
        });
        switch (tankSettings.work) {
            case 'OVERRIDE':
            case 'NEW_SETTINGS':
                tankSettings.work = tankSettings.active ? 'OPERATION' : 'OPERATION_STOPPED';
                break;
            case 'START':
                tankSettings.work = 'OPERATION';
                break;
            case 'STOP':
                tankSettings.work = 'OPERATION_STOPPED';
                break;
        }
        await tankSettings.save();
        return tankSettings.toJSON();
    }

}
module.exports = TankInteractor
