'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.UserAnswer, { foreignKey: 'user_id', as: 'user_answers' });
        }
    }
    User.init(
        {
            name: DataTypes.STRING,
            birth_place: DataTypes.STRING,
            birth_date: DataTypes.DATEONLY,
            gender: DataTypes.STRING,
            postal_code: DataTypes.STRING,
            address: DataTypes.TEXT,
            total_score: DataTypes.DECIMAL(5, 2),
            risk_level: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
        }
    );
    return User;
};
