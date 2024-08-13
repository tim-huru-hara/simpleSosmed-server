'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: "userId" })
    }
  }
  Post.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "userId required" },
        notEmpty: { msg: "userId required" }
      }
    },
    imageUrl: DataTypes.STRING,
    description: DataTypes.TEXT,
    likes: DataTypes.JSONB,
    comments: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};