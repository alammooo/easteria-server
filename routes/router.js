const UserController = require("../controllers/user")
const CustomerController = require("../controllers/customer")
const { authentication } = require("../middlewares/authentication")
const {
  bookmarkConsent,
  customerConsent,
  foodConsent,
  adminConsent,
} = require("../middlewares/authorization")

const router = require("express").Router()

router.post("/pub/register", CustomerController.register)
router.post("/pub/login", CustomerController.login)
// router.post("/pub/google-login", CustomerController.authGoogleLogin)

// router.get("/", UserController.redirect)
router.post("/register", UserController.registerAdmin)
router.post("/login", UserController.userLogin)
// router.post("/google-login", UserController.authGoogleLogin)

router.get("/pub/foods", CustomerController.findFood)
router.get("/pub/foods/:foodId", CustomerController.findFoodById)
router.get("/categories", UserController.findAllCategories)

router.use(authentication)

router.get("/pub/bookmarks", customerConsent, CustomerController.findBookmark)
router.post(
  "/pub/bookmarks/:foodId",
  customerConsent,
  CustomerController.createBookmark
)
router.delete(
  "/pub/bookmarks/:foodId",
  bookmarkConsent,
  CustomerController.deleteBookmark
)

router.get("/user", UserController.findUserById)

router.get("/foods", UserController.findAllFoods)
router.get("/foods/:foodId", UserController.findFoodById)
router.post("/categories", UserController.createCategory)
router.delete("/categories/:categoryId", UserController.deleteCategory)

router.post("/foods", UserController.createFood)
router.delete("/foods/:foodId", foodConsent, UserController.deleteFoodById)
router.patch("/foods/:foodId", adminConsent, UserController.updateFoodStatus)
router.put("/foods/:foodId", foodConsent, UserController.updateFoodDetail)

router.get("/histories", UserController.findAllHistory)

module.exports = router
