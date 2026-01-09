'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class InformationGroup extends Model {
        static associate(models) {
            InformationGroup.hasMany(models.GroupItem, { foreignKey: 'information_group_id', as: 'group_items' });
        }
    }
    InformationGroup.init(
        {
            code: DataTypes.STRING,
            name: DataTypes.STRING,
            weight: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'InformationGroup',
            tableName: 'information_groups',
        }
    );
    return InformationGroup;
};
