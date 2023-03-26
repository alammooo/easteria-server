const bcyrpt = require("bcryptjs")

class Bcyrpt {
  static hashPassword(pass) {
    return bcyrpt.hashSync(pass, 8)
  }

  static comparePassword(pass, hashedPassword) {
    return bcyrpt.compareSync(pass, hashedPassword)
  }
}

module.exports = {
  Bcyrpt,
}
