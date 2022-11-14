const Router = require("express")
const router = new Router()

const itemRouter = require("./itemRouter")
const userRouter = require("./userRouter")
const brandRouter = require("./brandRouter")
const typeRouter = require("./typeRouter")
const basketRouter = require("./basketRouter")
const orderRouter = require("./orderRouter")

const authMiddleWare = require("../middleware/authMiddleware")

router.use("/user", userRouter)
router.use("/basket", authMiddleWare, basketRouter)
router.use("/order", authMiddleWare, orderRouter)
router.use("/type", typeRouter)
router.use("/brand", brandRouter)
router.use("/item", itemRouter)


module.exports = router
