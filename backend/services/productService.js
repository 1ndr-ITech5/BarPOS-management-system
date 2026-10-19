const Product = require("../models/productModel.js")
const Category = require("../models/categoryModel.js")
const Order = require("../models/orderModel.js")
const OrderItem = require("../models/orderItemModel.js")
const {messageError} = require("../utils/messageErrors.js")

const getMenuItems = async(workspaceId) => {
    const products = await Product.find({offeredBy: workspaceId})
    .populate("offeredBy", "name").populate("categoryId", "categoryName")
    return products
}

const createNewMenuItem = async(productData, workspaceId) => {
    // check if all fields are given by the user
    const {productName, category, price} = productData
    if (!productName || !category || price === undefined){
        throw messageError("Please fill all the required fields!", 400)
    }

    // check for the product's name
    if (typeof productName !== "string"){
        throw messageError("The product's name must be given in a string data type form!", 422)
    }

    const clearProductName = productName.trim()
    if (clearProductName === ""){
        const error = new Error("Please ensure the name to be written in alphabetical symbols!")
        error.statusCode = 400
        throw error
    }

    // check for its category if its in this workspace and is active
    const activeCategory = await Category.findOne({categoryName: category, isActive: true, workspaceId})
    if (!activeCategory){
        const error = new Error("Cannot create a new menu item in a non-existing category nor inactive/archived one!")
        error.statusCode = 404
        throw error
    }

    // check if the product is unique in its own category and workspace
    const dubProduct = await Product.findOne({productName: clearProductName, offeredBy: workspaceId})
    if (dubProduct){
        const error = new Error("This product exists already in your workspace!")
        error.statusCode = 409
        throw error
    }

    // check for the product's price value
    if (typeof price !== "number" || !Number.isFinite(price) || price <= 0){
        throw messageError("Please give a positive number for the product's price!", 422)
    }

    // create the product
    let newProduct

    try {
        newProduct = await Product.create({
        productName: clearProductName,
        categoryId: activeCategory._id,
        price,
        offeredBy: workspaceId })
    } catch (error) {
        if (error.code === 11000) {
            throw messageError("A product with this name already exists in your workspace!", 409)
        }
    }

    return newProduct
}

const editMenuItem = async(productData, choosenProduct, workspaceId) => {
    if (choosenProduct.isArchived === true){
        throw messageError("Archived products cannot be edited!", 409)
    }

    // after checks, create the object that is going to set the product's new data
    const editedAttributes = {}

    const {productName, category, price} = productData
    // check if any data is given for edit
    if(productName === undefined && category === undefined && price === undefined){
        throw messageError("Please ensure giving atleast one new data to edit for any of the fields!", 400)
    }

    // check the product's name
    if(productName !== undefined){
        if (typeof productName !== "string" || productName.trim() === ""){
            throw messageError("The product's name must be a non-empty text!", 422)
        }
        
        //check if the product's name is unique in its workspace
        const dubProduct = await Product.findOne({
            productName: productName.trim(),
            offeredBy: workspaceId,
            _id: { $ne: choosenProduct._id }})
        if (dubProduct){
            throw messageError("This product exists already in your menu!", 409)
        }
        editedAttributes.productName = productName.trim()
    }

    // check the category
    const activeCategory = await Category.findOne({categoryName: category, isActive: true, workspaceId})
    if(category !== undefined){
        if (typeof activeCategory !== "string"){
            throw messageError("The category name should be given in a string data type format!")
        }
        if (!activeCategory){
            throw messageError("Cannot move a product in a non-existing or inactive/archived category!", 404)
        }
        editedAttributes.categoryId = activeCategory._id
    }

    // check the price
    if(price !== undefined){
        if (typeof price !== "number" || !Number.isFinite(price) || price <= 0){
            throw messageError("Please give a positive number for the product's price!", 422)
        }
        editedAttributes.price = price
    }

    try{
        return await Product.findOneAndUpdate(
            {_id: choosenProduct._id, offeredBy: workspaceId},
            {$set: editedAttributes},
            {runValidators: true, returnDocument: "after"}
        )
    }catch(error){
        if (error.code === 11000){
            throw messageError("A product with this name already exists in your menu!", 409)
        }
        throw error
    }
}

const toggleMenuItemActivity = async(productId, workspaceId) => {
    // find the item
    const product = await Product.findOne({_id: productId, offeredBy: workspaceId})
    if (!product){
        const error = new Error("Product does not exist!")
        error.statusCode = 404
        throw error
    } 

    // check if its category is inactive
    const productsCategory = await Category.findOne(
        {_id: product.categoryId, workspaceId})
    if(productsCategory.isActive === false){
        const error = new Error("Cannot change product's activity when its category is inactive!")
        error.statusCode = 409
        throw error
    }

    if(product.isArchived === true){
        const error = new Error("Cannot change status on archived products!")
        error.statusCode = 409
        throw error
    }

    product.isAvailable = !product.isAvailable
    await product.save()
}

const deleteMenuItem = async(productId, workspaceId) => {
    // find the item
    const product = await Product.findOne({_id: productId, offeredBy: workspaceId})
    if (!product){
        const error = new Error("Cannot delete a product that does not exist!")
        error.statusCode = 404
        throw error
    }

    // edge case for archived products
    if (product.isArchived === true){
        const error = new Error("Cannot perform this operation on an archived product!")
        error.statusCode = 409
        throw error
    }

    // ensure the product does not get deleted when in a open order
    const openOrders = await Order.find({workspaceId, status: "open"}).select("_id")
    const openOrderIds = openOrders.map(order => order._id)

    const productInOpenOrders = await OrderItem.exists({
        menuItemId: productId,
        orderId: {$in: openOrderIds}
    })
    if (productInOpenOrders){
        const error = new Error("Cannot delete a product that is on an open order!")
        error.statusCode = 409
        throw error
    }

    // find if this product has figured out in any historical order
    const closedOrders = await Order.find({workspaceId, status: "closed"}).select("_id")
    const closedOrderIds = closedOrders.map(order => order._id)

    const historicalProduct = await OrderItem.exists({
        menuItemId: productId,
        orderId: {$in: closedOrderIds}
    })
    if (historicalProduct){
        product.isAvailable = false
        product.isArchived = true
        await product.save()
    }else{
        await Product.findOneAndDelete({_id: productId, offeredBy: workspaceId})
    }
}

const restoreProduct = async(productId, workspaceId) => {
    // find the product on the workspace
    const product = await Product.findOne({_id: productId, offeredBy: workspaceId})
    if (!product){
        const error = new Error("This product does not exist!")
        error.statusCode = 404
        throw error
    }
    // make sure the product is archived
    if (product.isArchived !== true){
        const error = new Error("The product choosen to restore is actually not archived!")
        error.statusCode = 409
        throw error
    }
    // check if the product's category is archived
    const category = await Category.findOne({_id: product.categoryId, workspaceId: workspaceId})
    if(!category){
        const error = new Error("The product's category was not found!")
        error.statusCode = 404
        throw error
    }
    if (category.isArchived === true){
        const error = new Error("Not possible on restoring a product, when its category is archived!")
        error.statusCode = 409
        throw error
    }

    product.isArchived = false
    await product.save()
    return product
}

module.exports = {getMenuItems, createNewMenuItem, editMenuItem, toggleMenuItemActivity, deleteMenuItem, restoreProduct}