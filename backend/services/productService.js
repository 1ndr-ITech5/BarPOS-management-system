const Product = require("../models/productModel.js")
const Category = require("../models/categoryModel.js")
const Order = require("../models/orderModel.js")
const OrderItem = require("../models/orderItemModel.js")

const getMenuItems = async(workspaceId) => {
    const products = await Product.find({offeredBy: workspaceId})
    .populate("offeredBy", "name").populate("categoryId", "categoryName")
    return products
}

const createNewMenuItem = async(productData, workspaceId) => {
    // check if all fields are given by the user
    const {productName, category, price} = productData
    if (!productName || !category || price === undefined){
        const error = new Error("Please fill all the required fields!")
        error.statusCode = 400
        throw error
    }

    // check for the product's name
    if (typeof productName !== "string"){
        const error = new Error("Please ensure that the product's name is in a string form!")
        error.statusCode = 422
        throw error
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
    const dubProduct = await Product.findOne({productName: clearProductName, categoryId: activeCategory._id, offeredBy: workspaceId})
    if (dubProduct){
        const error = new Error("This product exists already in this category!")
        error.statusCode = 409
        throw error
    }

    // check for the product's price value
    if (typeof price !== "number" || !Number.isFinite(price) || price <= 0){
        const error = new Error("Please give a positive number for the product's price!")
        error.statusCode = 422
        throw error
    }

    // create the product
    const newProduct = await Product.create({
        productName: clearProductName, 
        categoryId: activeCategory._id,
        price: price,
        offeredBy: workspaceId
    })

    return newProduct
}

const editMenuItem = async(productData, choosenProduct, workspaceId) => {
    if (choosenProduct.isArchived === true){
        const error = new Error("Archived products cannot be edited!")
        error.statusCode = 409
        throw error
    }

    const {productName, category, price} = productData

    if(productName !== undefined){
        // check for the product's name
        if (typeof productName !== "string"){
            const error = new Error("Please ensure that the product's name is in a string form!")
            error.statusCode = 422
            throw error
        }
        if (productName.trim() === ""){
            const error = new Error("Please ensure the name to be written in alphabetical symbols!")
            error.statusCode = 400
            throw error
        }
        //check if the product's name is unique
        const dubProduct = await Product.findOne({productName: productName.trim(), 
            categoryId: choosenProduct.category._id, offeredBy: workspaceId, _id: {$ne: choosenProduct._id}})
        if (dubProduct){
            const error = new Error("The provided product name is figured already in its category!")
            error.statusCode = 409
            throw error
        }
    }

    const activeCategory = await Category.findOne({categoryName: category, isActive: true, workspaceId})
    if(category !== undefined){
        if (!activeCategory){
            const error = new Error("Cannot edit a menu's item category in a non-existing or inactive/archived one!")
            error.statusCode = 404
            throw error
        }
        if (productName !== undefined){
            const dubProduct = await Product.findOne({productName: productName.trim(), 
                categoryId: activeCategory._id, offeredBy: workspaceId, _id: {$ne: choosenProduct._id}})
            if (dubProduct){
                const error = new Error("The provided product name is figured already in its category!")
                error.statusCode = 409
                throw error
            }
        }else{
            const dubProduct = await Product.findOne({productName: choosenProduct.productName, 
                categoryId: activeCategory._id, offeredBy: workspaceId, _id: {$ne: choosenProduct._id}})
            if (dubProduct){
                const error = new Error("The provided product name is figured already in its category!")
                error.statusCode = 409
                throw error
            }
        }
    }

    if(price !== undefined){
        if (typeof price !== "number" || !Number.isFinite(price) || price <= 0){
            const error = new Error("Please give a positive number for the product's price!")
            error.statusCode = 422
            throw error
        }
    }

    if(productName === undefined && category === undefined && price === undefined){
        const error = new Error("Please ensure giving atleast one new data to edit for any of the fields!")
        error.statusCode = 400
        throw error
    }

    const editedAttributes = {}
    if(productName !== undefined){
        editedAttributes.productName = productName.trim()
    }
    if(category !== undefined){
        editedAttributes.categoryId = activeCategory._id
    }
    if(price !== undefined){
        editedAttributes.price = price
    }

    const updatedItem = await Product.findOneAndUpdate(
        { _id: choosenProduct._id, offeredBy: workspaceId },
        { $set: editedAttributes },
        { runValidators: true, new: true }
    );
    return updatedItem
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

module.exports = {getMenuItems, createNewMenuItem, editMenuItem, toggleMenuItemActivity, deleteMenuItem}