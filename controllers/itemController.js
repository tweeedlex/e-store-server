const uuid = require("uuid")
const path = require("path")
const { Item, Basket, BasketItem, Type, Brand } = require("../models")

class ItemController {
    async create(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            let { name, price, brandId, typeId, info, img } = req.body
            if (!img) {
                img = "https://banksiafdn.com/wp-content/uploads/2019/10/placeholde-image.jpg"
            }
            const item = await Item.create({ name, price, brandId, typeId, info, img })
            return res.json(item)
        } catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }

    async getAll(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            let { brandId, typeId, limit, page, itemList } = req.query

            page = page || 1
            limit = Number(limit) || 9
            let offset = page * limit - limit

            let items = []

            if (!brandId && !typeId) {
                items = await Item.findAndCountAll({ limit, offset })
            }
            if (brandId && !typeId) {
                items = await Item.findAndCountAll({ where: { brandId }, limit, offset })
            }
            if (!brandId && typeId) {
                items = await Item.findAndCountAll({ where: { typeId }, limit, offset })
            }
            if (brandId && typeId) {
                items = await Item.findAndCountAll({ where: { brandId, typeId }, limit, offset })
            }

            if (itemList) {
                items = []
                itemList = itemList.split(",").filter(item => item !== "")
                for (let itemId of itemList) {
                    const foundItem = await Item.findOne({ where: { id: +itemId } })
                    items.push(foundItem)
                }
                return res.json(items)
            }
            return res.json(items)
        } catch (e) {
            res.status(400).json(e)
            console.log(e)
        }
    }

    async getOne(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            const { id } = req.params
            const item = await Item.findOne({ where: { id } })
            res.status(200).json(item)
        } catch (e) {
            res.status(400).json(e)
            console.log(e)
        }
    }

    async delete(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            let { brandId, typeId } = req.query

            if (brandId && !typeId) {
                const items = await Item.findAll({ where: { brandId } })
                if (!items.length) {
                    return res.status(400).json({ message: "Invalid id" })
                }

                await Item.destroy({ where: { brandId } })
            }
            if (!brandId && typeId) {
                const items = await Item.findAll({ where: { typeId } })
                if (!items.length) {
                    return res.status(400).json({ message: "Invalid id" })
                }

                await Item.destroy({ where: { typeId } })
            }
            if (brandId && typeId) {
                const items = await Item.findAll({ where: { brandId, typeId } })
                if (!items.length) {
                    return res.status(400).json({ message: "Invalid ids" })
                }

                await Item.destroy({ where: { brandId, typeId } })
            }
            if (!brandId && !typeId) {
                return res.status(400).json({ message: "Invalid request" })
            }

            return res.status(200).json({ message: "Items deleted" })
        } catch (e) {
            res.status(400).json(e)
            console.log(e)
        }
    }

    async deleteOne(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            const { id } = req.params

            const item = await Item.findOne({ where: { id } })
            if (!item) {
                return res.status(400).json({ message: "Invalid id" })
            }

            await Item.destroy({ where: { id } })
            res.status(200).json({ message: "You deleted item with id " + id })
        } catch (e) {
            res.status(400).json(e)
            console.log(e)
        }
    }

    async getItemInfo(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")

            let itemInBasket = false

            const { itemId } = req.query

            const {typeId, brandId} = await Item.findOne({where: {id: itemId}})
            const {name: type} = await Type.findOne({where: {id: typeId}})
            const {name: brand} = await Brand.findOne({where: {id: brandId}})

            if (req.user) {
                const userId = req.user.id
                const basket = await Basket.findOne({ where: { userId } })
                const item = await BasketItem.findOne({ where: { basketId: basket.id, itemId } })

                if (item) {
                    itemInBasket = true
                }
            }

            return res.json({type, brand, itemInBasket})
        } catch (e) {
            res.status(400).json(e)
            console.log(e)
        }
    }
}

module.exports = new ItemController()