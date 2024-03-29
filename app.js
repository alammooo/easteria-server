if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 3000
const router = require("./routes/router")
const errorHandler = require("./middlewares/error-handler")

app.use(
  cors({
    credentials: true,
    origin: process.env.FE_ORIGIN?.split(','),
  }),
);

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(router)
app.use(errorHandler)

app.listen(port, () => {
  console.log("Listening to port", port)
})
