'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Item extends Model {
        static associate(models) {
            Item.belongsTo(models.GroupItem, { foreignKey: 'group_item_id', as: 'group_item' });
        }
    }
    Item.init(
        {
            group_item_id: DataTypes.INTEGER,
            label: DataTypes.STRING,
            value: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Item',
            tableName: 'items',
        }
    );
    return Item;
};
