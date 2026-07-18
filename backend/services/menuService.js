const Menu = require("../models/menuModel.js")

const getMenuItems = async() => {
    const products = await Menu.find()
    return products
}

module.exports = {getMenuItems}