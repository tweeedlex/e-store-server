const uuid = require("uuid")
const path = require("path")
const fs = require("fs")
const { Item } = require("../models")

class ItemController {
    async create(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            const { name, price, brandId, typeId, info } = req.body
            const { img } = req.files
            let fileName = uuid.v4() + ".jpg"
            img.name = fileName
            img.mv(path.resolve(__dirname, "..", "static"))
            console.log("img " + img.name)

            fs.readdir(path.resolve(__dirname, "..", "static"), (err, files) => {
                console.log(files)
            })

            const item = await Item.create({ name, price, brandId, typeId, info, img: fileName })
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
}

module.exports = new ItemController()