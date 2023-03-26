function errorHandler(error, req, res, next) {
  console.log("\n====================================\n", "\n", error)
  if (error.name === "SequelizeValidationError") {
    const errMsg = error.errors.map((el) => el.message)
    res.status(400).json({ message: errMsg })
  }
  if (error.name === "SequelizeUniqueConstraintError") {
    const errMsg = `${error.errors[0].message}, ${error.errors[0].value}`

    res.status(400).json({ message: errMsg })
  }
  if (error.name === "SequelizeDatbaseError") {
    res.status(400).json({ message: "Error on Database" })
  }
  if (error.name === "invalid Login") {
    res.status(401).json({ message: "Invalid Username / Password" })
  }
  if (error.name === "JsonWebTokenError" || error.name === "invalid token") {
    res.status(401).json({ message: "Token is invalid" })
  }
  if (error.name === "Data not found" && error.table === "Food") {
    res.status(404).json({ message: "Food is not found" })
  }
  if (error.name === "Data not found" && error.table === "Bookmark") {
    res.status(404).json({ message: "Bookmark is not found" })
  }
  if (error.name === "alreadyExist") {
    res.status(409).json({ message: "Bookmark already Exists" })
  }
  if (error.name === "Forbidden") {
    res.status(403).json({ message: "Not Allowed!" })
  }
}

module.exports = errorHandler
