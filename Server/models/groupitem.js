'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class GroupItem extends Model {
        static associate(models) {
            GroupItem.belongsTo(models.InformationGroup, { foreignKey: 'information_group_id', as: 'information_group' });
            GroupItem.hasMany(models.Item, { foreignKey: 'group_item_id', as: 'items' });
        }
    }
    GroupItem.init(
        {
            information_group_id: DataTypes.INTEGER,
            name: DataTypes.STRING,
            weight: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'GroupItem',
            tableName: 'group_items',
        }
    );
    return GroupItem;
};
