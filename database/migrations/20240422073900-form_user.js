'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('FormUser', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nama: {
                type: Sequelize.STRING
            },
            tanggal_lahir: {
                type: Sequelize.DATE
            },
            alamat: {
                type: Sequelize.STRING
            },
            id_user: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users', // Nama model pengguna yang direferensikan
                    key: 'id' // Nama kolom yang direferensikan
                },
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('FormUser');
    }
};