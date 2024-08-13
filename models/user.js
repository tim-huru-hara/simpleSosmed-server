'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email already taken"
      },
      validate: {
        isEmail: { msg: "Invalid email format" },
        notNull: { msg: "Email required" },
        notEmpty: { msg: "Email required" }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Username already taken"
      },
      validate: {
        notNull: { msg: "Username required" },
        notEmpty: { msg: "Username required" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Password required" },
        notEmpty: { msg: "Password required" }
      }
    },
    bio: DataTypes.TEXT,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};