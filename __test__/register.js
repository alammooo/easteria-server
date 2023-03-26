const request = require("supertest")
const app = require("../app")
const { sequelize } = require("../models")

afterAll(async function () {
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
		restartIdentity: true,
		cascade: true,
  })
})

describe("API Customer Register", () => {
  describe("POST /pub/register", () => {
    it("Success register customer and response 201", async () => {
      const payload = {
        username: "CustomerKun",
        email: "cust@mail.com",
        password: "wuuyPhUu",
        role: "Customer",
      }
      const res = await request(app).post("/pub/register").send(payload)
      expect(res.status).toBe(201)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty(
        "message",
        `Customer ${payload.email} successfully created`
      )
    })
  })
  describe("POST /pub/register", () => {
    it("Error register customer and response 401 no email", async () => {
      const payload = {
        email: undefined,
        password: "12345",
      }
      const res = await request(app).post("/pub/register").send(payload)
      expect(res.status).toBe(400)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty("message")
      expect(res.body.message).toBeInstanceOf(Array)
      expect(res.body.message[0]).toBe("Email is required")
    })
    it("Error register customer and response 401 no password", async () => {
      const payload = {
        email: "a@mail.com",
        password: undefined,
      }
      const res = await request(app).post("/pub/register").send(payload)
      expect(res.status).toBe(400)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty("message")
      expect(res.body.message).toBeInstanceOf(Array)
      expect(res.body.message[0]).toBe("Password is required")
    })
    it("Error register customer and response 401 no valid email", async () => {
      const payload = {
        email: "amai",
        password: "12345",
      }
      const res = await request(app).post("/pub/register").send(payload)
      expect(res.status).toBe(400)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty("message")
      expect(res.body.message[0]).toBe("Input type must be an Email")
    })
  })
})
