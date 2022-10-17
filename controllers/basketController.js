const { BasketItem, Basket, Item } = require("../models")

class BasketController {
    async add(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            const { id } = req.user
            const { itemId } = req.query

            const basket = await Basket.findOne({ where: { userId: id } })

            const item = await Item.findOne({ where: { id: itemId } })
            if (!item) {
                return res.status(400).json({ message: "Invalid item" })
            }

            // check if item already in basket

            const checkItem = await BasketItem.findOne({ where: { itemId, basketId: basket.id } })
            if (checkItem) {
                return res.status(400).json({ message: "Item already in basket" })
            }

            const basketItem = new BasketItem({ basketId: basket.id, itemId })
            await basketItem.save()

            res.status(200).json(basketItem)
        } catch (e) {
            res.status(400).json(e)
            console.log(e)
        }
    }

    async remove(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            const { id } = req.user
            const { itemId } = req.query

            const basket = await Basket.findOne({ where: { userId: id } })

            const item = await BasketItem.findOne({ where: { itemId } })
            if (!item) {
                return res.status(400).json({ message: "Invalid item" })
            }

            await BasketItem.destroy({ where: { itemId, basketId: basket.id } })
            return res.status(200).json({ message: "Item deleted" })
        } catch (e) {
            res.status(400).json(e)
            console.log(e)
        }
    }

    async get(req, res) {
        try {
            const { id } = req.user
            const basket = await Basket.findOne({ where: { userId: id } })
            const items = await BasketItem.findAll({ where: { basketId: basket.id } })
            return res.status(200).json(items)
        } catch (e) {
            res.status(400).json(e)
            console.log(e)
        }
    }
}

module.exports = new BasketController()