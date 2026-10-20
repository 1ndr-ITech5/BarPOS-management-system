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
        throw messageError("Please ensure the name to be written in alphabetical symbols!", 400)
    }

    // check for its category if its in this workspace and is active
    const activeCategory = await Category.findOne({categoryName: category, isActive: true, workspaceId})
    if (!activeCategory){
        throw messageError("Cannot create a new menu item in a non-existing category nor inactive/archived one!", 409)
    }

    // check if the product is unique in its own category and workspace
    const dubProduct = await Product.findOne({productName: clearProductName, offeredBy: workspaceId})
    if (dubProduct){
        throw messageError("This product exists already in your workspace!", 409)
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

const editMenuItem = async(productData, productId, workspaceId) => {
    // check if the product exists
    const productToEdit = await Product.findOne({_id: productId, offeredBy: workspaceId})
    if (!productToEdit){
        throw messageError("The product that you choose to edit, does not exist on your menu!", 404)
    }
    if(productToEdit.isArchived === true){
        throw messageError("An archived product cannot be edited!", 409)
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
            _id: { $ne: productToEdit._id }})
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
        await Product.findOneAndUpdate(
            {_id: productToEdit._id, offeredBy: workspaceId},
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
        throw messageError("Product does not exist!", 404)
    } 

    // check if its category is inactive
    const productsCategory = await Category.findOne(
        {_id: product.categoryId, workspaceId})
    if(productsCategory.isActive === false){
        throw messageError("Cannot change product's activity when its category is inactive!", 409)
    }

    if(product.isArchived === true){
        throw messageError("Cannot change status on archived products!", 409)
    }

    product.isAvailable = !product.isAvailable
    await product.save()
    return product
}

const deleteMenuItem = async(productId, workspaceId) => {
    // find the item
    const product = await Product.findOne({_id: productId, offeredBy: workspaceId})
    if (!product){
        throw messageError("Cannot delete a product that does not exist!", 404)
    }

    // edge case for archived products
    if (product.isArchived === true){
        throw messageError("Cannot perform this operation on an archived product!", 409)
    }

    // ensure the product does not get deleted when in a open order
    const openOrders = await Order.find({workspaceId, status: "open"}).select("_id")
    const openOrderIds = openOrders.map(order => order._id)

    const productInOpenOrders = await OrderItem.exists({
        menuItemId: productId,
        orderId: {$in: openOrderIds}
    })
    if (productInOpenOrders){
        throw messageError("Cannot delete a product that is on an open order!", 409)
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

const restoreMenuItem = async(productId, workspaceId) => {
    // find the product on the workspace
    const product = await Product.findOne({_id: productId, offeredBy: workspaceId})
    if (!product){
        throw messageError("This product does not exist!", 404)
    }
    // make sure the product is archived
    if (product.isArchived !== true){
        throw messageError("The product choosen to restore is actually not archived!", 409)
    }
    // check if the product's category is archived
    const category = await Category.findOne({_id: product.categoryId, workspaceId: workspaceId})
    if(!category){
        throw messageError("The product's category was not found!", 404)
    }
    if (category.isArchived === true){
        throw messageError("Not possible on restoring a product, when its category is archived!", 409)
    }

    product.isArchived = false
    await product.save()
    return product
}

module.exports = {getMenuItems, createNewMenuItem, editMenuItem, toggleMenuItemActivity, deleteMenuItem, restoreMenuItem}