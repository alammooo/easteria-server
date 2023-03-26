const request = require("supertest")
const app = require("../app")
const { User, sequelize } = require("../models")

beforeAll(async function () {
  await User.create({
    email: "a@mail.com",
    password: "12345",
    role: "Customer"
  })
})

afterAll(async function () {
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
		restartIdentity: true,
		cascade: true,
  })
})

describe("API Customer Login", function () {
  describe("POST /pub/login", function () {
    it("Success login customer and response 200", async function () {
      const payload = {
        email: "a@mail.com",
        password: "12345",
      }
      const res = await request(app).post("/pub/login").send(payload)
      expect(res.status).toBe(200)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty("access_token")
      expect(res.body).toHaveProperty("message", `Logged in as : ${payload.email}`)
    })
  })
  describe("POST /pub/login", function () {
    it("Error login customer and response 401 invalid data", async function () {
      const payload = {
        email: "b@mail.com",
        password: "12345",
      }
      const res = await request(app).post("/pub/login").send(payload)
      expect(res.status).toBe(401)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("message", "Invalid Username / Password")
    })
    it("Error login customer and response 401 invalid data", async function () {
      const payload = {
        email: "a@mail.com",
        password: "000000",
      }
      const res = await request(app).post("/pub/login").send(payload)
      expect(res.status).toBe(401)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("message", "Invalid Username / Password")
    })
  })
})
