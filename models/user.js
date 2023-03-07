const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');
const sequelize = require('../config/database');
class User extends Sequelize.Model {}
User.init(
    {
        name: {
            type: DataTypes.STRING,
          },
          email: {
            type: DataTypes.STRING
          },
          password: {
            type: DataTypes.TEXT
          },
    },
        { sequelize, modelName: 'users' },
  );
  module.exports = User;