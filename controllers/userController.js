const { User, Basket } = require("../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secret = require("../config").secret
const {validationResult} = require("express-validator")

const createAccessToken = (user) => {
    const payload = {
        email: user.email,
        id: user.id,
        role: user.role
    }

    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class UserController {
    async registration(req, res) {
        try {
            // validation
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()})
            }

            console.log(req.body)
            const {email, password} = req.body

            const candidate = await User.findOne({where: {email}})
            if (candidate) {
                return res.status(400).json({message: "User with this email already exists"})
            }

            const hashPassword = bcrypt.hashSync(password, 5)
            const user = new User({email, password: hashPassword, role: "USER"})
            await user.save()

            const basket = new Basket({userId: user.id})
            await basket.save()

            return res.status(200).json({message: "You succesfully registered"})
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }       
    }

    async login(req, res) {
        try {
            const {email, password} = req.body

            const user = await User.findOne({where: {email}})
            if (!user) {
                return res.status(400).json({message: "User was not found"})
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
                return res.status(400).json({message: "Invalid password"})
            }

            const token = createAccessToken(user)
            return res.json(token)
        } catch (e) {
            console.log(e)
            res.status(400).json(e)
        }       
    }
}

module.exports = new UserController()