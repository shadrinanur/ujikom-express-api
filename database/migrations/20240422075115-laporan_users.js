'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('LaporanUser', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            judul_laporan: {
              allowNull: false,
                type: Sequelize.STRING
            },
            tanggal_laporan: {
              allowNull: false,
                type: Sequelize.DATE
            },
            jumlah_kegiatan: {
              allowNull: false,
                type: Sequelize.STRING
            },
            deskripsi_pekerjaan: {
              allowNull: false,
                type: Sequelize.STRING
            },
            id_user: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', // Nama model pengguna yang direferensikan
                    key: 'id' // Nama kolom yang direferensikan
                }
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
        await queryInterface.dropTable('LaporanUser');
    }
};
