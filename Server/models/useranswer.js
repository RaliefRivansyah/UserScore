'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserAnswer extends Model {
        static associate(models) {
            UserAnswer.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
            UserAnswer.belongsTo(models.GroupItem, { foreignKey: 'group_item_id', as: 'group_item' });
            UserAnswer.belongsTo(models.Item, { foreignKey: 'item_id', as: 'item' });
        }
    }
    UserAnswer.init(
        {
            user_id: DataTypes.INTEGER,
            group_item_id: DataTypes.INTEGER,
            item_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'UserAnswer',
            tableName: 'user_answers',
        }
    );
    return UserAnswer;
};
