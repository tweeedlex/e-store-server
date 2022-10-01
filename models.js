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
})

const Item = sequelize.define("item", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
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

const TypeBrand = sequelize.define("type_brand", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
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

Type.belongsToMany(Brand, {through: TypeBrand})
Brand.belongsToMany(Type, {through: TypeBrand})

module.exports = {
    User, 
    Basket,
    BasketItem,
    Item,
    Brand,
    Type,
    TypeBrand
}