const { Op } = require('sequelize');
const moment = require('moment');

class TankInteractor {
    constructor(models, mailgun) {
        this.models = models;
        this.mailgun = mailgun;
    }

    async getTank(id) {
        return await this.models.tank.findOne({
            where: { tank_id: id },
            include: [{
                model: models.tank_settings,
                as: 'settings'
            }, {
                model: models.tank_report,
                as: 'reports',
                where: {
                    createdAt: {
                        [Op.gte]: moment().subtract(3, 'days').toDate()
                    }
                }
            }]
        });
    }

    async getTankSettings(request) {
        const tankSettings = await this.models.tank_settings.findOne({
            where: { tank_id: request.id }
        });
        return tankSettings;
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
        return report;
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
        return tankSettings;
    }


}
module.exports = TankInteractor
