const asyncHandler = require("express-async-handler")
const {getMenuItems} = require("../services/menuService.js")

const getProducts = asyncHandler(async(req,res) => {
    const products = await getMenuItems();
    res.status(200).json(products)
})

module.exports = {getProducts}