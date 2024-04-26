'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FormUsers extends Model {
    static associate(models) {
      FormUsers.belongsTo(models.Users, { foreignKey: 'id_user' });
    }
  }
  
  FormUsers.init({
    nama: DataTypes.STRING,
    tanggal_lahir: DataTypes.DATE, // Perbaikan: penulisan kolom 'tanggal_lahir'
    alamat: DataTypes.STRING,
    id_user: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FormUser',
  });

  return FormUsers;
};