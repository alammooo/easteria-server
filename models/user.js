"use strict"
const { Model } = require("sequelize")
const { Bcyrpt } = require("../helpers/bcyrpt")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Food, { foreignKey: "authorId" })
      User.hasMany(models.Bookmark)
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "Email is required" },
          notEmpty: { msg: "Email is required" },
          isEmail: { msg: "Input type must be an Email" },
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password is required" },
          notEmpty: { msg: "Password is required" },
          len: { args: 5, msg: "Password length must be greater than 5" },
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Role is required" },
          notNull: { msg: "Role is required" },
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      phoneNumber: {
        type: DataTypes.STRING,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      address: {
        type: DataTypes.STRING,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  )
  User.beforeCreate(function (instance, options) {
    instance.password = Bcyrpt.hashPassword(instance.password)
  })
  return User
}
