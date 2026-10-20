const asyncHandler = require("express-async-handler")
const {getMenuItems, createNewMenuItem, editMenuItem, toggleMenuItemActivity,
    deleteMenuItem, restoreMenuItem} = require("../services/productService.js")

const getProducts = asyncHandler(async(req,res) => {
    const products = await getMenuItems(req.user.workspaceId);
    res.status(200).json(products)
})

const createProduct = asyncHandler(async(req,res) => {
    const {workspaceId} = req.user
    const newProduct = await createNewMenuItem(req.body, workspaceId)
    res.status(201).json({response: `${newProduct.productName} is added successfully on the menu!`})
})

const editProduct = asyncHandler(async(req,res) => {
    const {workspaceId} = req.user
    const {productId} = req.params
    await editMenuItem(req.body, productId, workspaceId)
    res.status(200).json({response: "The product was edited successfully!"})
})

const toggleProductActivity = asyncHandler(async(req,res) => {
    const {workspaceId} = req.user
    const {productId} = req.params
    const toggledProduct = await toggleMenuItemActivity(productId, workspaceId)
    res.status(200).json({response: `${toggledProduct.productName} set to ${toggledProduct.isAvailable}.`})
})

const deleteProduct = asyncHandler(async(req,res) => {
    const {workspaceId} = req.user
    const {productId} = req.params
    await deleteMenuItem(productId, workspaceId)
    res.status(200).json({response: "Product removed from the menu!"})
})

const restoreProduct = asyncHandler(async(req,res) => {
    const {workspaceId} = req.user
    const {productId} = req.params
    const product = await restoreMenuItem(productId, workspaceId)
    res.status(200).json({response: `${product} is back on your active section of menu page!`})
})

module.exports = {getProducts, createProduct, editProduct, toggleProductActivity, deleteProduct, restoreProduct}