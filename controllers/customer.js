const { Bcyrpt } = require("../helpers/bcyrpt")
const { Customer } = require("../models")
const { User, Food, Category, Bookmark } = require("../models")
const { generateToken } = require("../helpers/jwt")
const { Op } = require("sequelize")

class CustomerController {
  static async register(req, res, next) {
    try {
      const {
        username = "NewCustomer",
        email,
        password,
        role = "Customer",
        phoneNumber,
        address,
      } = req.body
      const createUser = await User.create({
        username,
        email,
        password,
        role,
        phoneNumber,
        address,
      })

      res.status(201).json({
        message: `Customer ${createUser.email} successfully created`,
      })
    } catch (error) {
      next(error)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      if (!email || !password) throw { name: "invalid Login" }
      const user = await User.findOne({
        where: { email },
      })

      if (!user) throw { name: "invalid Login" }
      const validPassword = Bcyrpt.comparePassword(password, user.password)
      if (!validPassword) throw { name: "invalid Login" }
      const payload = {
        id: user.id,
        role: user.role,
      }

      const access_token = generateToken(payload)
      res.status(200).json({ access_token, message: `Logged in as : ${email}` })
    } catch (error) {
      next(error)
    }
  }

  // static async authGoogleLogin(req, res, next) {
  //   try {
  //     const googleToken = req.headers["google-oauth-token"]
  //     const ticket = await client.verifyIdToken({
  //       idToken: googleToken,
  //       audience: CLIENT_ID,
  //     })
  //     const payload = ticket.getPayload()
  //     const { email, name } = payload

  //     const [user, created] = await Customer.findOrCreate({
  //       where: { email: email },
  //       defaults: {
  //         username: name,
  //         email: email,
  //         password: "UsingGoogleToLogin",
  //         role: "Customer",
  //       },
  //       hooks: false,
  //     })
  //     const googlePayload = {
  //       id: user.id,
  //     }

  //     const access_token = generateToken(googlePayload)
  //     res.status(200).json({
  //       message: `Login with ${user.email}`,
  //       access_token: access_token,
  //     })
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  static async findFood(req, res, next) {
    try {
      const { filterBy, page } = req.query

      const options = {
        limit: 8,
        offset: page ? (page - 1) * 8 : 1,
      }

      if (filterBy !== "" && typeof filterBy !== "undefined") {
        options.where = {
          categoryId: {
            [Op.eq]: filterBy,
          },
        }
      }

      options.order = [["id", "ASC"]]

      options.include = [
        {
          model: User,
          attributes: ["username", "email"],
        },
        {
          model: Category,
          attributes: ["name"],
        },
      ]

      const { count, rows } = await Food.findAndCountAll(options)

      res.status(200).json({ totalFoods: count, listOfFoods: rows })
    } catch (error) {
      next(error)
    }
  }

  static async findFoodById(req, res, next) {
    try {
      const { foodId } = req.params

      const findFoodById = await Food.findByPk(foodId, {
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: Category,
            attributes: ["name"],
          },
        ],
      })

      if (findFoodById === null) throw { name: `Data not found`, table: "Food" }
      if (findFoodById.User.username === null) {
        findFoodById.User.username = "Admin"
      }
      res.status(200).json({
        foodWithId: findFoodById.id,
        food: findFoodById,
      })
    } catch (error) {
      next(error)
    }
  }

  static async findBookmark(req, res, next) {
    try {
      const { id } = req.user


      const options = {}

      options.where = {
        UserId: id,
      }
      options.include = [
        {
          model: Food,
        },
      ]

      const bookmarkList = await Bookmark.findAll(options)
      res.status(200).json({ BookmarkList: bookmarkList })
    } catch (error) {
      next(error)
    }
  }

  static async createBookmark(req, res, next) {
    try {
      const { foodId } = req.params
      const { id } = req.user
      const findFood = await Food.findByPk(foodId)
      if (!findFood) {
        throw { name: "Data not found", table: "Food" }
      }

      const options = {
        where: {
          UserId: id,
          FoodId: foodId,
        },
      }
      const [foodData, created] = await Bookmark.findOrCreate(options)

      if (!created) {
        throw { name: "alreadyExist" }
      }

      res.status(201).json({
        Bookmark: `Food with name ${findFood.name} successfully added to bookmark`,
      })
    } catch (error) {
      next(error)
    }
  }

  static async deleteBookmark(req, res, next) {
    try {
      const { foodId } = req.params

      const deleteBookmark = await Bookmark.destroy({
        where: { FoodId: foodId },
      })

      if (deleteBookmark === 0)
        throw { name: "Data not found", table: "Bookmark" }

      res
        .status(200)
        .json({ message: "Successfully delete food from bookmark" })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CustomerController
