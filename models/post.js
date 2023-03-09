const { Sequelize, DataTypes, Model } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');
const sequelize = require('../config/database');
const Post = sequelize.define('post', {
          name: {
            type: DataTypes.STRING,
          },
          user_id: {
            type: DataTypes.STRING
          }
    },
        { sequelize, modelName: 'posts' },
  );
  module.exports = Post;