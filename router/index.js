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
router.use("/type", authMiddleWare, roleMiddleWare("ADMIN"), typeRouter)
router.use("/brand", authMiddleWare, roleMiddleWare("ADMIN"), brandRouter)
router.use("/item", authMiddleWare, roleMiddleWare("ADMIN"), itemRouter)

router.get("/test", authMiddleWare, roleMiddleWare("ADMIN"), (req, res) => res.json("res"))
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 


module.exports = router
