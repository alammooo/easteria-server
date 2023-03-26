const request = require("supertest")
const app = require("../app")
const { generateToken } = require("../helpers/jwt")
const { User } = require("../models")
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

  const user = await User.findOne({
    where: {
      email: "cust@mail.com",
    },
  })
  access_token = generateToken({ id: user.id })
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
})

describe("API Customer Food", function () {
  describe("GET /pub/foods", function () {
    it("Succecssfully get Food data and response 200", async function () {
      const res = await request(app).get("/pub/foods")

      expect(res.status).toBe(200)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty("totalFoods")
      expect(res.body).toHaveProperty("listOfFoods")
      expect(res.body.listOfFoods).toBeInstanceOf(Array)
      expect(res.body.listOfFoods[0]).toHaveProperty("id", expect.any(Number))
      expect(res.body.listOfFoods[0]).toHaveProperty("name", expect.any(String))
      expect(res.body.listOfFoods[0]).toHaveProperty(
        "description",
        expect.any(String)
      )
      expect(res.body.listOfFoods[0]).toHaveProperty(
        "price",
        expect.any(Number)
      )
      expect(res.body.listOfFoods[0]).toHaveProperty(
        "imgUrl",
        expect.any(String)
      )
      expect(res.body.listOfFoods[0]).toHaveProperty(
        "status",
        expect.any(String)
      )

      expect(res.body.listOfFoods[0].User).toBeInstanceOf(Object)
      expect(res.body.listOfFoods[0].User).toHaveProperty(
        "username",
        expect.any(String)
      )
      expect(res.body.listOfFoods[0].User).toHaveProperty(
        "email",
        expect.any(String)
      )

      expect(res.body.listOfFoods[0].Category).toBeInstanceOf(Object)
      expect(res.body.listOfFoods[0]).toHaveProperty("name", expect.any(String))
    })

    it("Succecssfully get Food data with filter and response 200", async function () {
      const res = await request(app).get("/pub/foods?filterBy=2")

      expect(res.status).toBe(200)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty("totalFoods")
      expect(res.body).toHaveProperty("listOfFoods")
      expect(res.body.listOfFoods).toBeInstanceOf(Array)
      expect(res.body.listOfFoods[0]).toHaveProperty("id", expect.any(Number))
      expect(res.body.listOfFoods[0]).toHaveProperty("name", expect.any(String))
      expect(res.body.listOfFoods[0]).toHaveProperty(
        "description",
        expect.any(String)
      )
      expect(res.body.listOfFoods[0]).toHaveProperty(
        "price",
        expect.any(Number)
      )
      expect(res.body.listOfFoods[0]).toHaveProperty(
        "imgUrl",
        expect.any(String)
      )
      expect(res.body.listOfFoods[0]).toHaveProperty(
        "authorId",
        expect.any(Number)
      )
      expect(res.body.listOfFoods[0]).toHaveProperty("categoryId", 2)
      expect(res.body.listOfFoods[0]).toHaveProperty(
        "status",
        expect.any(String)
      )

      expect(res.body.listOfFoods[0].User).toBeInstanceOf(Object)
      expect(res.body.listOfFoods[0].User).toHaveProperty(
        "username",
        expect.any(String)
      )
      expect(res.body.listOfFoods[0].User).toHaveProperty(
        "email",
        expect.any(String)
      )

      expect(res.body.listOfFoods[0].Category).toBeInstanceOf(Object)
      expect(res.body.listOfFoods[0]).toHaveProperty("name", expect.any(String))
    })

    it("Succecssfully get Food data with pagination and response 200", async function () {
      const res = await request(app).get(
        "/pub/foods?page[size]=8&page[number]=2"
      )

      expect(res.status).toBe(200)
      expect(res.body).toBeInstanceOf(Object)

      expect(res.body).toHaveProperty("totalFoods", 8)

      expect(res.body).toHaveProperty("page")
      expect(res.body.page).toBeInstanceOf(Object)
      expect(res.body.page).toHaveProperty("size", "8")
      expect(res.body.page).toHaveProperty("number", "2")

      expect(res.body).toHaveProperty("listOfFoods")
      expect(res.body.listOfFoods).toBeInstanceOf(Array)
      expect(res.body.listOfFoods[0]).toHaveProperty("id", expect.any(Number))
      expect(res.body.listOfFoods[0]).toHaveProperty("name", expect.any(String))
      expect(res.body.listOfFoods[0]).toHaveProperty(
        "description",
        expect.any(String)
      )
      expect(res.body.listOfFoods[0]).toHaveProperty(
        "price",
        expect.any(Number)
      )
      expect(res.body.listOfFoods[0]).toHaveProperty(
        "imgUrl",
        expect.any(String)
      )
      expect(res.body.listOfFoods[0]).toHaveProperty(
        "authorId",
        expect.any(Number)
      )
      expect(res.body.listOfFoods[0]).toHaveProperty(
        "categoryId",
        expect.any(Number)
      )
      expect(res.body.listOfFoods[0]).toHaveProperty(
        "status",
        expect.any(String)
      )

      expect(res.body.listOfFoods[0].User).toBeInstanceOf(Object)
      expect(res.body.listOfFoods[0].User).toHaveProperty(
        "username",
        expect.any(String)
      )
      expect(res.body.listOfFoods[0].User).toHaveProperty(
        "email",
        expect.any(String)
      )

      expect(res.body.listOfFoods[0].Category).toBeInstanceOf(Object)
      expect(res.body.listOfFoods[0]).toHaveProperty("name", expect.any(String))
    })

    it("Succecssfully get Food with id 1 and response 200", async function () {
      const res = await request(app)
        .get("/pub/foods/1")
        .set("access_token", access_token)

      expect(res.status).toBe(200)
      expect(res.body).toBeInstanceOf(Object)

      expect(res.body).toHaveProperty("foodWithId", 1)

      expect(res.body).toHaveProperty("food")
      expect(res.body.food).toBeInstanceOf(Object)

      expect(res.body.food).toHaveProperty("id", 1)
      expect(res.body.food).toHaveProperty("name", expect.any(String))
      expect(res.body.food).toHaveProperty("description", expect.any(String))
      expect(res.body.food).toHaveProperty("price", expect.any(Number))
      expect(res.body.food).toHaveProperty("imgUrl", expect.any(String))
      expect(res.body.food).toHaveProperty("authorId", expect.any(Number))
      expect(res.body.food).toHaveProperty("categoryId", expect.any(Number))
      expect(res.body.food).toHaveProperty("status", expect.any(String))

      expect(res.body.food.User).toBeInstanceOf(Object)
      expect(res.body.food.User).toHaveProperty("username", expect.any(String))

      expect(res.body.food.Category).toBeInstanceOf(Object)
      expect(res.body.food.Category).toHaveProperty("name", expect.any(String))
    })

    it("Failed to get Food with id 1 and response 401", async function () {
      const res = await request(app).get("/pub/foods/1")

      expect(res.status).toBe(401)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty("message", "Token is invalid")
    })

    it("Failed to get Food which id isnt exists in database and response 404", async function () {
      const res = await request(app)
        .get("/pub/foods/1000000")
        .set("access_token", access_token)

      expect(res.status).toBe(404)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty("message", "Food is not found")
    })

    it("Failed to get Food while token is invalid and response 401", async function () {
      const res = await request(app).get("/pub/foods/1")

      expect(res.status).toBe(401)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty("message", "Token is invalid")
    })
  })
})
