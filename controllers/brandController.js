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
}

module.exports = new BrandController()