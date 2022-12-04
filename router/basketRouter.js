const Router = require("express")
const router = new Router()
const basketController = require("../controllers/basketController")

router.post("/add", basketController.add)
router.post("/remove", basketController.remove)
router.delete("/removeAll", basketController.removeAll)

router.get("/amount", basketController.getAmount)
router.put("/", basketController.updateAmount)

router.get("/", basketController.get)


module.exports = router
