const { Food, Category, Bookmark } = require("../models")

async function foodConsent(req, res, next) {
  try {
    const { foodId, categoryId } = req.params
    const { id, role } = req.user

    const findFood = await Food.findByPk(foodId)
    if (findFood === null) throw { name: `Data not found` }
    if (role === "Admin") {
      next()
    } else if (role === "Staff") {
      if (foodId) {
        if (findFood.dataValues.authorId !== id) {
          throw { name: "Forbidden" }
        }
      }
      if (categoryId) {
        throw { name: "Forbidden" }
      }

      next()
    }
  } catch (error) {
    next(error)
  }
}

async function adminConsent(req, res, next) {
  try {
    const { role } = req.user

    if (role === "Admin") {
      next()
      return
    } else {
      throw { name: "Forbidden" }
    }
  } catch (error) {
    next(error)
  }
}

async function bookmarkConsent(req, res, next) {
  try {
    const { id, role } = req.user

    if (role !== "Customer") {
      throw { name: "Forbidden" }
    }

    const { foodId } = req.params
    const findBookmark = await Bookmark.findOne({ where: { FoodId: foodId } })

    if (findBookmark === null)
      throw { name: "Data not found", table: "Bookmark" }
    if (findBookmark.UserId !== id) throw { name: "Forbidden" }
    else {
      next()
    }
  } catch (error) {
    next(error)
  }
}

async function customerConsent(req, res, next) {
  try {
    if (req.user.role !== "Customer") {
      throw { name: "Forbidden" }
    }
    next()
  } catch (error) {
    next(error)
  }
}
module.exports = { foodConsent, adminConsent, bookmarkConsent, customerConsent }
