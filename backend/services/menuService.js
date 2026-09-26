const Menu = require("../models/menuModel.js")

const getMenuItems = async(workspaceId) => {
    const products = await Menu.find({offeredBy: workspaceId}).populate("offeredBy", "name")
    return products
}

module.exports = {getMenuItems}