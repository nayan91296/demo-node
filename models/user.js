const { Sequelize, DataTypes, Model } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');
const sequelize = require('../config/database');
const User = sequelize.define('user', {
        name: {
            type: DataTypes.STRING,
          },
          email: {
            type: DataTypes.STRING
          },
          password: {
            type: DataTypes.TEXT
          },
          profile:{
            type: DataTypes.TEXT,
            get() {
                let value = this.getDataValue('profile'); 
                return process.env.APP_IMAGE_BASE_URL + value;
            }
          }
    },
        { sequelize, modelName: 'users' },
  );
  module.exports = User;