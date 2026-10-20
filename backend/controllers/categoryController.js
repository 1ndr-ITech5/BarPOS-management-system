const {getCategories, createCategory, 
    changeCatActivity, editCategoryName, deleteCategory, restoreCategory} = require("../services/categoryService.js")
const asyncHandler = require("express-async-handler")

const getAllCategories = asyncHandler(async(req, res) => {
    const {workspaceId} = req.user 
    const allCategories = await getCategories(workspaceId)
    res.status(200).json(allCategories)
}) 

const createNewCategory = asyncHandler(async(req,res) => {
    const {categoryName} = req.body
    const newCategory = await createCategory(req.user, categoryName)
    res.status(201).json({
        response: `Category: ${newCategory.categoryName} was created successfully!`
    })
})

const toggleCategoryActivity = asyncHandler(async(req, res) => {
    const {categoryId} = req.params
    await changeCatActivity(req.user, categoryId)
    res.status(200).json({response: "Status activity changed!"})
}) 

const editCategory = asyncHandler(async(req, res) => {
    const {categoryId} = req.params
    const {categoryName} = req.body
    await editCategoryName(req.user, categoryId, categoryName)
    res.status(200).json({response: "Category updated successfully!"})
})

const deleteCategoryController = asyncHandler(async(req, res) => {
    const {categoryId} = req.params
    await deleteCategory(req.user, categoryId)
    res.status(200).json({response: "Category deleted successfully!"})
})

const restoreCategoryController = asyncHandler(async(req, res) => {
    const {categoryId} = req.params
    const {workspaceId} = req.user
    const restoredCategory = await restoreCategory(categoryId, workspaceId)
    res.status(200).json({response: `${restoredCategory.categoryName} is back on your active categories list!`})
})

module.exports = {getAllCategories, createNewCategory, toggleCategoryActivity, 
    editCategory, deleteCategoryController, restoreCategoryController}