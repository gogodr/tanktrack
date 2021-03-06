module.exports = (sequalize, DataTypes) => {
    const TankSettings = sequalize.define('tank_settings', {
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        schedule: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '00 00 01 * * *'
        },
        dispense_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3000
        },
        override_dispense: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        work: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'OPERATION_STOPPED'
        },
        last_activity:{
            type: DataTypes.DATE,
            allowNull: true
        },
        last_dispense:{
            type: DataTypes.DATE,
            allowNull: true
        },
    });
    TankSettings.associate = (models) => {
        TankSettings.belongsTo(models.tank, {
            foreignKey: {
                name: 'tank_id',
                primaryKey: true
            }
        })
    }
    return TankSettings;
}