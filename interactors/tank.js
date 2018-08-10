const { Op } = require('sequelize');
const moment = require('moment');
const config = require('config');

class TankInteractor {
    constructor(models, mailgun) {
        this.models = models;
        this.mailgun = mailgun;
        this.mail_list = config.get('mailgun.mail_list')
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
        if (tankSettings) {
            return tankSettings.toJSON();
        } else {
            return false;
        }
    }

    async getTankWork(request) {
        const tankSettings = await this.models.tank_settings.findOne({
            where: { tank_id: request.id }
        });
        if (tankSettings) {
            return tankSettings.work;
        } else {
            return false;
        }
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
        switch (request.report) {
            case 'OPERATION_RESUMED':
            case 'OPERATION_STOPPED':
            case 'DISPENSE_ERROR_STOPPED':
            case 'SUCCESSFUL_DISPENSE':
                const tank = await this.models.tank.findById(request.id);
                const business_unit_location = await this.models.business_unit_location.findById(tank.business_unit_location_id);
                const business_unit = await this.models.business_unit.findById(business_unit_location.business_unit_id);
                const business = await this.models.business.findById(business_unit.business_id);
                const mailSubject = `Tank Report in: ${business.name}>${business_unit.name}>${business_unit_location.name}`;
                const mailBody = `Tank Report in: ${business.name}>${business_unit.name}>${business_unit_location.name}\n` +
                    `Tank: ${tank.tank_id}\n` +
                    `Report: ${request.report}` +
                    `Last Activity: ${tank_settings.last_activity}\n` +
                    `Last Dispense: ${tank_settings.last_dispense}`;
                this.sendMail(mailSubject, mailBody);
                break;
        }
        return report.toJSON();
    }

    async sendMail(mailSubject, mailBody) {
        this.mailgun.messages().send({
            from: 'Tanktrack <tanktrack@limaem.com>',
            to: this.mail_list,
            subject: mailSubject,
            text: mailBody
        }, (err, body) => {
            if (err) {
                console.log('Mailgun Error:', err);
            }
            console.log('Mailgun', body);
        });
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
