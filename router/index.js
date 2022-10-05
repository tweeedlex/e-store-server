const Router = require("express")
const router = new Router()

const itemRouter = require("./itemRouter")
const userRouter = require("./userRouter")
const brandRouter = require("./brandRouter")
const typeRouter = require("./typeRouter")
const basketRouter = require("./basketRouter")

const authMiddleWare = require("../middleware/authMiddleware")
const roleMiddleWare = require("../middleware/roleMiddleware")

router.use("/user", userRouter)
router.use("/basket", authMiddleWare, basketRouter)
router.use("/type", typeRouter)
router.use("/brand", brandRouter)
router.use("/item", itemRouter)


module.exports = router
