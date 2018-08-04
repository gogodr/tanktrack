const { Op } = require('sequelize');
const moment = require('moment');

class TankInteractor {
    constructor(models) {
        this.models = models;
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
}
module.exports = TankInteractor
