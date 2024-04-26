'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LaporanUsers extends Model {
    static associate(models) {
      LaporanUsers.belongsTo(models.Users, { foreignKey: 'id_user' });
    }
  }
  
  LaporanUsers.init({
    judul_laporan: DataTypes.STRING,
    tanggal_laporan: DataTypes.DATE,
    jumlah_kegiatan: DataTypes.STRING,
    deskripsi_pekerjaan: DataTypes.STRING,
    id_user: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LaporanUser',
  });

  return LaporanUsers;
};
