const Router = require("express")
const router = new Router()
const orderController = require("../controllers/orderController")
const roleMiddleware = require("../middleware/roleMiddleware")

router.post("/", orderController.add)
router.delete("/", roleMiddleware("MANAGER"), orderController.remove)
router.put("/", roleMiddleware("MANAGER"), orderController.complete)
router.get("/", roleMiddleware("MANAGER"), orderController.get)

module.exports = router