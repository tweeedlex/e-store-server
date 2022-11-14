const { Order, User, OrderItem } = require("../models")

class OrderController {
    async add(req, res) {
        try {
            const {items, name, surname, fathersName, phone, deliveryMethod, deliveryAddress} = req.body

            if (!items || !name || !surname || !phone || !deliveryMethod || !deliveryAddress) {
                return res.status(400).json({message: "Missing fields"})
            }

            await Order.create({name, surname, fathersName: fathersName || null, phone, deliveryMethod, deliveryAddress, items, userId: +req.user.id})

            return res.status(200).json({message: "Order created"})
        } catch (e) {
            res.status(400).json(e)
            console.log(e)
        }
    }

    async complete(req, res) {
        try {
            const {id} = req.query
            if (!id) {
                return res.status(400).json({message: "No id"})
            }

            const {completed} = await Order.findOne({where: {id}})
            if (completed) {
                return res.status(400).json({message: "Order is already completed"})
            }

            await Order.update({completed: true}, {where: {id}})
            return res.status(200).json({message: "Order completed"})
        } catch (e) {
            res.status(400).json(e)
            console.log(e)
        }
    }

    async remove(req, res) {
        try {
            const {id} = req.query
            if (!id) {
                return res.status(400).json({message: "No id"})
            }

            await Order.destroy({where: {id}})
            return res.status(200).json({message: "Order removed"})
        } catch (e) {
            res.status(400).json(e)
            console.log(e)
        }
    }

    async get(req, res) {
        try {
            let {page, limit, completed} = req.query 
            
            page = page || 1
            limit = Number(limit) || 10
            let offset = page * limit - limit
            
            let orders = []
            
            if (completed !== undefined) {
                completed = (completed === "true" ? true : false)
                orders = await Order.findAndCountAll({where: {completed}, limit, offset})
            } else {
                orders = await Order.findAndCountAll({limit, offset})
            }

            return res.status(200).json(orders)
        } catch (e) {
            res.status(400).json(e)
            console.log(e)
        }
    }
}

module.exports = new OrderController()