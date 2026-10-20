const Category = require("../models/categoryModel.js")
const Product = require("../models/productModel.js")
const Order = require("../models/orderModel.js")
const OrderItem = require("../models/orderItemModel.js")
const mongoose = require("mongoose")

// get all the categories
const getCategories = async(workspaceId) => {
    const categories = await Category.find({workspaceId: workspaceId})
    return categories
}

// create a new category
const createCategory = async(adminData, categoryName) => {
    // trim the category name
    const clearCategoryName = categoryName.trim()

    // check if the name field is given
    if (!clearCategoryName){
        const error = new Error("Please enter the category name!")
        error.statusCode = 400
        throw error
    }

    // check if this category name is unique on its own workspace
    const dublicatedCategory = await Category.findOne({workspaceId: adminData.workspaceId, categoryName: clearCategoryName})
    if (dublicatedCategory){
        const error = new Error("This category exists already in your workspace!")
        error.statusCode = 409
        throw error
    }

    const newCategory = await Category.create({
        categoryName: clearCategoryName,
        workspaceId: adminData.workspaceId
    })

    return newCategory;
}

// change the availability status of category
const changeCatActivity = async(adminData, categoryId) => {
    // check if the selected category exists
    const category = await Category.findOne({_id: categoryId, workspaceId: adminData.workspaceId})
    if (!category){
        const error = new Error("Cannot change the activity for a category that does not even exists!")
        error.statusCode = 404
        throw error
    }

    // ensure this category is not archived
    if(category.isArchived === true){
        const error = new Error("An archived category cannot be edited!")
        error.statusCode = 409
        throw error
    }

    const session = await mongoose.startSession()

    try{
        await session.startTransaction()
        const newStatus = category.isActive === true ? false : true
        await Category.findByIdAndUpdate(categoryId, 
            {$set: {isActive: newStatus} }, {runValidators: true, new: true, session})
        await session.commitTransaction()
    }catch(error){
        await session.abortTransaction()
        throw error
    }finally{
        await session.endSession()
    }
} 

// edit the category
const editCategoryName = async(adminData, categoryId, categoryName) => {
    // check if the selected category exists
    const category = await Category.findOne({_id: categoryId, workspaceId: adminData.workspaceId})
    if (!category){
        const error = new Error("Cannot edit a category that does not even exist!")
        error.statusCode = 404
        throw error
    }

    // ensure this category is not archived
    if(category.isArchived === true){
        const error = new Error("An archived category cannot be edited!")
        error.statusCode = 409
        throw error
    }

    // trim the category name
    const clearCategoryName = categoryName.trim()

    // check if the name field is given
    if (!clearCategoryName){
        const error = new Error("Please enter the category name!")
        error.statusCode = 400
        throw error
    }

    // check if this category name is unique on its own workspace
    const dublicatedCategory = await Category.findOne({workspaceId: adminData.workspaceId, 
        categoryName: clearCategoryName, _id:{$ne: categoryId}})
        if (dublicatedCategory){
            const error = new Error("The new category name should be unique!")
            error.statusCode = 409
            throw error
        }

    await Category.findByIdAndUpdate(categoryId, {categoryName: clearCategoryName}, {runValidators: true, new: true})
}

// delete the category 
const deleteCategory = async(adminData, categoryId) => {
    // check if the selected category exists
    const category = await Category.findOne({_id: categoryId, workspaceId: adminData.workspaceId})
    if (!category){
        const error = new Error("Cannot delete a category that does not even exist!")
        error.statusCode = 404
        throw error
    }

    if(category.isArchived === true){
        const error = new Error("Cannot perform delete for an archived category!")
        error.statusCode = 409
        throw error
    }

    const session = await mongoose.startSession()

    try{
        await session.startTransaction()
        const products = await Product.find({categoryId: category._id, 
            offeredBy: adminData.workspaceId}).select("_id").session(session)
        const productIds = products.map(prod => prod._id)
        // check if any of these products is on an active order
        const activeOrders = await Order.find({status: "open", 
            workspaceId: adminData.workspaceId}).select("_id").session(session)
        const activeOrderIds = activeOrders.map(order => order._id)
        const activeOrderItems = await OrderItem.exists(
            {orderId: {$in: activeOrderIds}, menuItemId: {$in: productIds}}).session(session)
        if (activeOrderItems){
            const error = new Error("This operation is not available when a product on this category is on an active order")
            error.statusCode = 409
            throw error
        }
        // check if the products have historical orders
        const closedOrders = await Order.find(
            {status: "closed", workspaceId: adminData.workspaceId}).select("_id").session(session)
        const closedOrderIds = closedOrders.map(order => order._id)
        const closedOrderItems = await OrderItem.exists(
            {orderId: {$in: closedOrderIds}, menuItemId: {$in: productIds}}).session(session)
        if (closedOrderItems){
            await Product.updateMany(
                {categoryId: category._id, isArchived: false, offeredBy: adminData.workspaceId},
                {$set: {isArchived: true, isAvailable: false}},
                {runValidators: true, session})
            await Category.findByIdAndUpdate(categoryId, 
                {isArchived: true, isActive: false}, 
                {runValidators: true, new: true, session})
        }else{
            await Product.deleteMany({categoryId: category._id, isArchived: false, offeredBy: adminData.workspaceId}, {session})
            await Category.findOneAndDelete({_id: categoryId, workspaceId: adminData.workspaceId}, {session})
        }
        await session.commitTransaction()
    }catch(error){
        await session.abortTransaction()
        throw error
    }finally{
        await session.endSession()
    }
}

const restoreCategory = async(categoryId, workspaceId) => {
    // find the category object
    const category = await Category.findOne({_id: categoryId, workspaceId: workspaceId})
    if (!category){
        const error = new Error("Cannot perform this operation on a category that does not even exist!")
        error.statusCode = 404
        throw error
    }
    // check if that category is archived
    if(category.isArchived !== true){
        const error = new Error("How can you restore a category that is not even archived?")
        error.statusCode = 409
        throw error
    }

    // perform its restore
    category.isArchived = false
    category.isActive = true
    await category.save()
    return category
}

module.exports = {getCategories, createCategory, changeCatActivity, editCategoryName, deleteCategory, restoreCategory}