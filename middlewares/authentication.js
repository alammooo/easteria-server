const { verifyToken } = require("../helpers/jwt")
const { User } = require("../models")

async function authentication(req, res, next) {
  try {
    const { access_token } = req.headers
    if (!access_token) {
      throw { name: "invalid token" }
    }

    const payload = verifyToken(access_token)
    if (!payload) throw { name: "invalid token" }

    const user = await User.findByPk(payload.id)
    if (!user) {
      throw { name: "invalid token" }
    }

    req.user = {
      id: user.id,
      role: user.role,
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { authentication }
