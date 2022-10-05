const Router = require("express")
const router = new Router()
const userController = require("../controllers/userController")
const {body} = require('express-validator')

router.post(
    "/registration", 
    body("email").isEmail(), 
    body("password").isLength({min: 8, max: 16}), 
    userController.registration
)

router.post("/login", userController.login)

module.exports = router
