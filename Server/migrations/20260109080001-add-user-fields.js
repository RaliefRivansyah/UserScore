'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Users', 'name', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('Users', 'birth_place', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('Users', 'birth_date', {
            type: Sequelize.DATEONLY,
            allowNull: true,
        });
        await queryInterface.addColumn('Users', 'gender', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('Users', 'postal_code', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('Users', 'address', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.addColumn('Users', 'total_score', {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: true,
        });
        await queryInterface.addColumn('Users', 'risk_level', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Users', 'name');
        await queryInterface.removeColumn('Users', 'birth_place');
        await queryInterface.removeColumn('Users', 'birth_date');
        await queryInterface.removeColumn('Users', 'gender');
        await queryInterface.removeColumn('Users', 'postal_code');
        await queryInterface.removeColumn('Users', 'address');
        await queryInterface.removeColumn('Users', 'total_score');
        await queryInterface.removeColumn('Users', 'risk_level');
    },
};
