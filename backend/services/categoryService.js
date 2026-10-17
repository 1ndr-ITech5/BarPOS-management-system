const Category = require("../models/categoryModel.js")

// get all the categories
const getCategories = async(workspaceId) => {
    const categories = await Category.find({workspaceId: workspaceId, isArchive: false})
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

    await Category.findByIdAndUpdate(categoryId, {isActive: !category.isActive }, {runValidators: true, new: true})
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

    await Category.findOneAndDelete({_id: categoryId, workspaceId: adminData.workspaceId})
}

module.exports = {getCategories, createCategory, changeCatActivity, editCategoryName, deleteCategory}