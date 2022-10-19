const Router = require("express")
const router = new Router()
const userController = require("../controllers/userController")
const {body} = require('express-validator')
const authMiddleware = require("../middleware/authMiddleware")

router.post(
    "/registration", 
    body("email").isEmail(), 
    body("password").isLength({min: 8, max: 16}), 
    userController.registration
)

router.post("/login", userController.login)
router.get("/email", authMiddleware, userController.getEmail)
router.get("/", authMiddleware, userController.getRole)

module.exports = router
