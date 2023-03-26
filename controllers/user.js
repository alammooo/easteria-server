const { Bcyrpt } = require("../helpers/bcyrpt")
const { generateToken } = require("../helpers/jwt")
const { Food, User, Category, History } = require("../models")
const { OAuth2Client } = require("google-auth-library")
const CLIENT_ID = process.env["CLIENT_ID"]
const client = new OAuth2Client(CLIENT_ID)

class UserController {
  // static async authGoogleLogin(req, res, next) {
  //   try {
  //     const googleToken = req.headers["google-oauth-token"]
  //     const ticket = await client.verifyIdToken({
  //       idToken: googleToken,
  //       audience: CLIENT_ID,
  //     })
  //     const payload = ticket.getPayload()
  //     const { email, name } = payload

  //     const [user, created] = await User.findOrCreate({
  //       where: { email: email },
  //       defaults: {
  //         username: name,
  //         email: email,
  //         password: "UsingGoogleToLogin",
  //         role: "Staff",
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

  static async registerAdmin(req, res, next) {
    try {
      const { 
        username = "NewAdmin",
        email,
        password,
        role = "Admin",
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
        message: `User ${createUser.email} successfully created`,
        createUser,
      })
    } catch (error) {
      next(error)
    }
  }

  static async userLogin(req, res, next) {
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
      }

      const access_token = generateToken(payload)

      res.status(200).json({ access_token })
    } catch (error) {
      next(error)
    }
  }

  static async findUserById(req, res, next) {
    const { id } = req.user
    try {
      const findUser = await User.findByPk(id)
      res.status(200).json({ message: "find User : ", findUser })
    } catch (error) {
      next(error)
    }
  }

  static async findAllCategories(req, res, next) {
    try {
      const categoryLists = await Category.findAll()
      res.status(200).json(categoryLists)
    } catch (error) {
      next(error)
    }
  }

  static async createCategory(req, res, next) {
    try {
      const { id } = req.user
      const { name } = req.body
      const category = await Category.create({ name })
      if (category === null) throw { name: `Data not found` }
      const user = await User.findByPk(id)
      res.status(200).json({
        message: `Category "${category.name}" successfully created`,
        category,
      })

      await History.create({
        title: "Create Category -- PATCH",
        description: `Created category with name ${category.name}`,
        updatedBy: `${user.email}`,
      })
    } catch (error) {
      next(error)
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      const { categoryId } = req.params
      const categoryToDelete = await Category.findByPk(categoryId)
      const findFoodWithCategory = await Food.findAll({
        where: {
          categoryId,
        },
      })

      if (categoryToDelete === null) throw { name: `Data not found` }
      let deleteCategoryById
      if (findFoodWithCategory === null) {
        deleteCategoryById = await categoryToDelete.destroy()
      } else {
        await Food.destroy({
          where: {
            categoryId,
          },
        })
        deleteCategoryById = await categoryToDelete.destroy()
      }

      if (deleteCategoryById === 0) throw { name: `Data not found` }
      res.status(200).json({
        message: `Category with name "${categoryToDelete.name}" successfully deleted`,
      })
    } catch (error) {
      next(error)
    }
  }

  static async findAllFoods(req, res, next) {
    try {
      const foodLists = await Food.findAll({
        include: [
          {
            model: User,
            attributes: ["username", "email"],
          },
          {
            model: Category,
            attributes: ["name"],
          },
        ],
      })

      res.status(200).json({totalFoods : foodLists.length, message: "List of Food : ", foodLists })
    } catch (error) {
      next(error)
    }
  }

  static async createFood(req, res, next) {
    try {
      const { name, description, price, imgUrl, categoryId } = req.body
      const { id } = req.user
      const foods = await Food.create({
        name,
        description,
        price,
        imgUrl,
        authorId: req.user.id,
        categoryId,
      })
      const user = await User.findByPk(id)
      await History.create({
        title: foods.name,
        description: `Food with id ${foods.dataValues.id} created`,
        updatedBy: `${user.email}`,
      })
      res.status(201).json({ message: "Food created", foods })
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

      if (findFoodById === null) throw { name: `Data not found` }
      if (findFoodById.User.username === null) {
        findFoodById.User.username = "admin"
      }
      res.status(200).json({
        message: `Food with id : ${findFoodById.name}`,
        foods: findFoodById,
      })
    } catch (error) {
      next(error)
    }
  }

  static async deleteFoodById(req, res, next) {
    try {
      const { foodId } = req.params
      const findFoodById = await Food.findByPk(foodId)
      if (findFoodById === null) throw { name: `Data not found` }

      const id = foodId
      const deleteById = await Food.destroy({ where: { id } })
      if (deleteById === 0) throw { name: `Data not found` }
      res.status(200).json({
        message: `Food with name "${findFoodById.name}" has been removed`,
      })
    } catch (error) {
      next(error)
    }
  }

  static async updateFoodStatus(req, res, next) {
    try {
      const { foodId } = req.params
      const { status } = req.body
      const { id } = req.user
      const findFoodById = await Food.findByPk(foodId)
      const oldStatus = findFoodById.status

      if (findFoodById === null) throw { name: `Data not found` }
      const updatedStatus = await findFoodById.update({ status: status })
      const user = await User.findByPk(id)
      await History.create({
        title: findFoodById.name,
        description: `Food status with id ${findFoodById.id} has been updated from ${oldStatus} to ${updatedStatus.status}`,
        updatedBy: `${user.email}`,
      })

      res.status(200).json({
        message: `Food with name "${findFoodById.name}" has been updated`,
      })
    } catch (error) {
      next(error)
    }
  }

  static async updateFoodDetail(req, res, next) {
    try {
      const { foodId } = req.params
      const { id } = req.user
      const { name, description, price, imgUrl, authorId, categoryId } =
        req.body
      const findFoodById = await Food.findByPk(foodId)

      if (findFoodById === null) throw { name: `Data not found` }

      await findFoodById.update({
        name,
        description,
        price,
        imgUrl,
        authorId,
        categoryId,
      })

      const user = await User.findByPk(id)
      await History.create({
        title: findFoodById.name,
        description: `Food with id ${findFoodById.id} has been updated`,
        updatedBy: `${user.email}`,
      })

      res.status(200).json({
        message: `Food with name "${findFoodById.name}" has been updated`,
      })
    } catch (error) {
      next(error)
    }
  }

  static async findAllHistory(req, res, next) {
    try {
      const historyData = await History.findAll({
        order: [["createdAt", "DESC"]],
      })
      res.status(200).json({
        message: `History :`,
        history: historyData,
      })
    } catch (error) {
      next(error)
    }
  }

  static async redirect(req, res, next) {
    try {
      res.redirect("/login")
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserController
