const uuidv4 = require('uuid/v4');
module.exports = (sequalize, DataTypes) => {
    const BusinessUnitLocation = sequalize.define('business_unit_location', {
        business_unit_location_id: {
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
    BusinessUnitLocation.associate = (models) => {
        BusinessUnitLocation.belongsTo(models.business_unit, {
            foreignKey: {
                name: 'business_unit_id'
            }
        })
    }
    return BusinessUnitLocation;
}