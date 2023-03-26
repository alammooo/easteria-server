"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bookmark.belongsTo(models.User)
      Bookmark.belongsTo(models.Food)
    }
  }
  Bookmark.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
        },
      },
      FoodId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Food",
        },
      },
    },
    {
      sequelize,
      modelName: "Bookmark",
    }
  )
  return Bookmark
}
