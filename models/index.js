import Sequelize from 'sequelize';

const sequelize = new Sequelize('cencosudtest', 'admin', 'cencosudtest', {
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

export default models;
