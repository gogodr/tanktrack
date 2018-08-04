const uuidv4 = require('uuid/v4');
export default (sequalize, DataTypes) => {
    const BusinessUnit = sequalize.define('business_unit', {
        business_unit_id: {
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
    BusinessUnit.associate = (models) => {
        BusinessUnit.belongsTo(models.business, {
            foreignKey: {
                name: 'business_id'
            }
        })
    }
    return BusinessUnit;
}