const {Brand} = require("../models")

class BrandController {
    async create(req, res) {
        try {
            const {name} = req.body
            const brand = await Brand.create({name})
            return res.json(brand)
        } catch (e) {
            console.log(e)
            res.status(400).json(e)
        }        
    }

    async getAll(req, res) {
        try {
            const brands = await Brand.findAll()
            return res.json(brands)
        } catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }

    async getOne(req, res) {
        try {
            const {id} = req.params
            const brand = await Brand.findOne({where: {id}})
            return res.json(brand.name)
        } catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    } 

    async delete(req, res) {
        try {
            const {id} = req.params
            const brand = await Brand.findOne({where: {id}})
            if (!brand) {
                return res.status(400).json({message: "Invalid id"})
            }

            await Brand.destroy({where: {id}})
            return res.status(200).json({message: "You deleted brand with id " + id})
        } catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }
}

module.exports = new BrandController()