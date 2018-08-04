const uuidv4 = require('uuid/v4');
module.exports = (sequalize, DataTypes) => {
    const Business = sequalize.define('business', {
        business_id: {
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
    Business.associate = (models) => {
        Business.belongsTo(models.user, {
            foreignKey: {
                name: 'user_id'
            }
        })
    }
    return Business;
}