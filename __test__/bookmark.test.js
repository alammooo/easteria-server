const request = require("supertest")
const app = require("../app")
const { generateToken } = require("../helpers/jwt")
const { Food, User, Bookmark } = require("../models")
const { sequelize } = require("../models")

beforeAll(async () => {
  const users = require("../data/data.json").Users.map((el) => {
    el.createdAt = new Date()
    el.updatedAt = new Date()
    return el
  })
  await sequelize.queryInterface.bulkInsert("Users", users, {})

  const categories = require("../data/data.json").Categories.map((el) => {
    el.createdAt = new Date()
    el.updatedAt = new Date()
    return el
  })
  await sequelize.queryInterface.bulkInsert("Categories", categories, {})

  const foods = require("../data/data.json").Foods.map((el) => {
    el.createdAt = new Date()
    el.updatedAt = new Date()
    return el
  })
  await sequelize.queryInterface.bulkInsert("Food", foods, {})

  const customer = await User.findOne({
    where: {
      email: "cust@mail.com",
    },
  })
  access_token = generateToken({ id: customer.id })

  const admin = await User.findOne({
    where: {
      role: "Admin",
    },
  })
console.log(admin, "INI ADMINISTRATOR")
  admin_token = generateToken({ id: admin.id })

  const bookmarks = {
    UserId: 3,
    FoodId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  try {
    const bookmarkList = await sequelize.queryInterface.bulkInsert(
      "Bookmarks",
      bookmarks,
      {}
    )
    console.log(bookmarkList ,"INI BOOKMARK LIST")
  } catch (error) {
    console.log(error)
  }
})

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Food", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  })
  await sequelize.queryInterface.bulkDelete("Categories", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  })
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  })
  await sequelize.queryInterface.bulkDelete("Bookmarks", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  })
})

describe("API Customer Bookmarks", function () {
  describe("GET /pub/bookmarks", function () {
    it("Succecssfully get Bookmarks and response 200", async function () {
      const res = await request(app)
        .get("/pub/bookmarks")
        .set("access_token", access_token)

      expect(res.status).toBe(200)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty("BookmarkList")
      expect(res.body.BookmarkList).toBeInstanceOf(Array)
      expect(res.body.BookmarkList).toHaveProperty("id", expect.any(Number))
      expect(res.body.BookmarkList).toHaveProperty("UserId", expect.any(Number))
      expect(res.body.BookmarkList).toHaveProperty("FoodId", expect.any(Number))
      expect(res.body.BookmarkList).toHaveProperty("Food")
      expect(res.body.BookmarkList.Food).toBeInstanceOf(Object)
      expect(res.body.BookmarkList.Food).toHaveProperty(
        "id",
        expect.any(Number)
      )
      expect(res.body.BookmarkList.Food).toHaveProperty(
        "name",
        expect.any(String)
      )
      expect(res.body.BookmarkList.Food).toHaveProperty(
        "description",
        expect.any(String)
      )
      expect(res.body.BookmarkList.Food).toHaveProperty(
        "price",
        expect.any(Number)
      )
      expect(res.body.BookmarkList.Food).toHaveProperty(
        "imgUrl",
        expect.any(String)
      )
      expect(res.body.BookmarkList.Food).toHaveProperty(
        "authorId",
        expect.any(Number)
      )
      expect(res.body.BookmarkList.Food).toHaveProperty(
        "categoryId",
        expect.any(Number)
      )
      expect(res.body.BookmarkList.Food).toHaveProperty("status", "Active")
    })

    it("Succecssfully add Food with id 1 to User's Bookmark and response 201", async function () {
      const res = await request(app).post("/pub/bookmarks/1").set("access_token", access_token)

      expect(res.status).toBe(201)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty("Bookmark")
      const firstFood = await Food.findByPk(1)
      expect(res.body).toHaveProperty("Bookmark",
        `Food with name ${firstFood.name} successfully added to bookmark`
      )
    })

    it("Fail to add Bookmark cause no data and response 404", async function () {
      const res = await request(app)
        .post("/pub/bookmarks/10000")
        .set("access_token", access_token)

      expect(res.status).toBe(404)
      expect(res.body).toBeInstanceOf(Object)

      expect(res.body).toHaveProperty("message", "Food is not found")
    })

    it("Failed to add bookmark cause not logged in and response 401", async function () {
      const res = await request(app).get("/pub/bookmarks")

      expect(res.status).toBe(401)
      expect(res.body).toBeInstanceOf(Object)

      expect(res.body).toHaveProperty("message", "Token is invalid")
    })

    it("Failed to get Food with id 1 and response 401", async function () {
      const res = await request(app).get("/pub/foods/1")

      expect(res.status).toBe(401)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty("message", "Token is invalid")
    })

    it("Failed to get bookmark cause role not Customer and response 403", async function () {
      const res = await request(app)
        .get("/pub/bookmarks")
        .set("access_token", admin_token)
        
      expect(res.status).toBe(403)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty("message", "Not Allowed!")
    })
  })
})
