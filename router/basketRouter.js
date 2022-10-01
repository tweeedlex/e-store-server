const Router = require("express")
const router = new Router()
const basketController = require("../controllers/basketController")

router.post("/add", basketController.add)
router.post("/remove", basketController.remove)
router.get("/", basketController.get)

module.exports = router
