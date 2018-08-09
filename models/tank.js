const uuidv4 = require('uuid/v4');
module.exports = (sequalize, DataTypes) => {
    const Tank = sequalize.define('tank', {
        tank_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => uuidv4()
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    Tank.associate = (models) => {
        Tank.belongsTo(models.business_unit_location, {
            foreignKey: {
                name: 'business_unit_location_id'
            }
        });
        Tank.hasOne(models.tank_settings, { as: 'settings', foreignKey: 'tank_id'  });
        Tank.hasMany(models.tank_report, { as: 'reports', foreignKey: 'tank_id', sourceKey: 'tank_id' });
    }
    return Tank;
}