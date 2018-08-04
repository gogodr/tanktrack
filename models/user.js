const uuidv4 = require('uuid/v4');
export default (sequalize, DataTypes) => {
    const User = sequalize.define('user', {
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => uuidv4()
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
            timestamps: false
        });
    return User;
}