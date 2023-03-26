const jwt = require("jsonwebtoken")
const keyless = process.env.JWT_KEY

function generateToken(payload) {
    return jwt.sign(payload, keyless)
}

function verifyToken(token) {
    return jwt.verify(token, keyless)
}


module.exports = { generateToken, verifyToken }