'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Food.belongsTo(models.User, { foreignKey: "authorId" })
      Food.belongsTo(models.Category, { foreignKey: "categoryId" })
      Food.hasMany(models.Bookmark)
    }

    static statusList = ["Active", "Inactive", "Archived"]


  }
  Food.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Food name is required" },
        notEmpty: { msg: "Food name is required" }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Description is required" },
        notEmpty: { msg: "Description is required" }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Price is required" },
        notEmpty: { msg: "Price is required" },
        min: {
          args: 5,
          msg: "Minimum price is 5€"
        }
      },

    },
    imgUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: "Image is required" },
        notEmpty: { msg: "Image is required" }
      }
    },
    authorId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    status: {
      defaultValue: "Active",
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Status is required" },
        notEmpty: { msg: "Status is required" }
      }
    }
  }, {
    sequelize,
    modelName: 'Food',
  });
  return Food;
};