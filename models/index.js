const Sequelize = require('sequelize');
const config = require('config');
const sequelize = new Sequelize(config.get('postgresql.database'), config.get('postgresql.user'), config.get('postgresql.password'), {
    dialect: 'postgres',
    logging: false
});

const models = {
    user: sequelize.import('./user'),
    business: sequelize.import('./business'),
    business_unit: sequelize.import('./business_unit'),
    business_unit_location: sequelize.import('./business_unit_location'),
    tank: sequelize.import('./tank'),
    tank_settings: sequelize.import('./tank_settings'),
    tank_report: sequelize.import('./tank_report'),
};

Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
