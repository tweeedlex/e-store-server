const Router = require("express")
const router = new Router()
const itemController = require("../controllers/itemController")
const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

router.post("/", authMiddleware, roleMiddleware("ADMIN"), itemController.create)
router.get("/", itemController.getAll)
router.get("/:id", itemController.getOne)

module.exports = router
