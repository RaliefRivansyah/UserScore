'use strict';
const { Model } = require('sequelize');
const { hash } = require('../helpers/bcrypt');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.UserAnswer, { foreignKey: 'user_id', as: 'user_answers' });
        }
    }
    User.init(
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    msg: 'Username sudah digunakan',
                },
                validate: {
                    notNull: {
                        msg: 'Username tidak boleh kosong',
                    },
                    notEmpty: {
                        msg: 'Username tidak boleh kosong',
                    },
                    len: {
                        args: [3, 30],
                        msg: 'Username harus antara 3-30 karakter',
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Password tidak boleh kosong',
                    },
                    notEmpty: {
                        msg: 'Password tidak boleh kosong',
                    },
                    len: {
                        args: [6],
                        msg: 'Password minimal 6 karakter',
                    },
                },
            },
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
            hooks: {
                beforeCreate: (user) => {
                    user.password = hash(user.password);
                },
            },
        }
    );
    return User;
};
