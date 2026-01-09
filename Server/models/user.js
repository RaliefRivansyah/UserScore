'use strict';
const { Model } = require('sequelize');
const { hash } = require('../helpers/bcrypt');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // define association here
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
