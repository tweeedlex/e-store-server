const sequelize = require("./db")
const {DataTypes} = require("sequelize")

const User = sequelize.define("user", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"}
})

const Basket = sequelize.define("basket", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BasketItem = sequelize.define("basket_item", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    amount: {type: DataTypes.INTEGER, defaultValue: 1, allowNull: false}
})

const Item = sequelize.define("item", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    info: {type: DataTypes.JSON},
    img: {type: DataTypes.STRING, allowNull: false}
})

const Type = sequelize.define("type", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Brand = sequelize.define("brand", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Order = sequelize.define("order", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    completed: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    name: {type: DataTypes.STRING, allowNull: false},
    surname: {type: DataTypes.STRING, allowNull: false},
    fathersName: {type: DataTypes.STRING, allowNull: true},
    phone: {type: DataTypes.STRING, allowNull: false},
    deliveryMethod: {type: DataTypes.STRING, allowNull: false},
    deliveryAddress: {type: DataTypes.STRING, allowNull: false},
    items: {type: DataTypes.JSON, allowNull: false}
})

const Rating = sequelize.define("rating", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rating: {type: DataTypes.INTEGER, allowNull: false}
})

User.hasOne(Basket)
Basket.belongsTo(User)

Basket.hasMany(BasketItem)
BasketItem.belongsTo(Basket)

Type.hasMany(Item)
Item.belongsTo(Type)

Brand.hasMany(Item)
Item.belongsTo(Brand)

Item.hasMany(BasketItem)
BasketItem.belongsTo(Item)

User.hasMany(Order)
Order.belongsTo(User)

Item.hasMany(Rating)
Rating.belongsTo(Item)

User.hasMany(Rating)
Rating.belongsTo(User)

module.exports = {
    User, 
    Basket,
    BasketItem,
    Item,
    Brand,
    Type,
    Order,
    Rating
}