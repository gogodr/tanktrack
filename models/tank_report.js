const uuidv4 = require('uuid/v4');
export default (sequalize, DataTypes) => {
    const TankReport = sequalize.define('tank_report', {
        tank_report_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => uuidv4()
        },
        report: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'KEEP_ALIVE'
        }
    });
    TankReport.associate = (models) => {
        TankReport.belongsTo(models.tank, {
            foreignKey: {
                name: 'tank_id'
            }
        })
    }
    return TankReport;
}