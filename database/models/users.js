'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.hasMany(models.FormUser, { foreignKey: 'id_user' }); // Perubahan: Menggunakan model FormUser
      Users.hasMany(models.LaporanUser, { foreignKey: 'id_user' }); // Perubahan: menggunakan hasMany
    }
  }
  
  Users.init({
    username: DataTypes.STRING, 
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });

  return Users;
};