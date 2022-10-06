const uuid = require("uuid")
const path = require("path")
const { Item } = require("../models")

class ItemController {
    async create(req, res) {
        try {
            const {name, price, brandId, typeId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, "..", "static", fileName))

            const item = await Item.create({name, price, brandId, typeId, info, img: fileName})
            return res.json(item)
        } catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }

    async getAll(req, res) {
        try {
            let {brandId, typeId, limit, page, itemList} = req.query

            page = page || 1
            limit = Number(limit) || 9
            let offset = page * limit - limit

            let items = []

            if (!brandId && !typeId) {
                items = await Item.findAndCountAll({limit, offset})
            }
            if (brandId && !typeId) {
                items = await Item.findAndCountAll({where: {brandId}, limit, offset})
            }
            if (!brandId && typeId) {
                items = await Item.findAndCountAll({where: {typeId}, limit, offset})
            }
            if (brandId && typeId) {
                items = await Item.findAndCountAll({where: {brandId, typeId}, limit, offset})
            }

            if (itemList) {
                items = []
                itemList = itemList.split(",").filter(item => item !== "")
                console.log(itemList)
                for (let itemId of itemList) {
                    const foundItem = await Item.findOne({where: {id: +itemId}})
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
            const {id} = req.params
            const item = await Item.findOne({where: {id}})
            res.status(200).json(item)
        } catch (e) {
            res.status(400).json(e)
            console.log(e)
        }        
    }
}

module.exports = new ItemController()