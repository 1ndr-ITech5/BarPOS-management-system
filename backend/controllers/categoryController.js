const {getCategories, createCategory, 
    changeCatActivity, editCategoryName, deleteCategory} = require("../services/categoryService.js")
const asyncHandler = require("express-async-handler")

const getAllCategories = asyncHandler(async(req, res) => {
    const {workspaceId} = req.user 
    const allCategories = await getCategories(workspaceId)
    res.status(200).json(allCategories)
}) 

const createNewCategory = asyncHandler(async(req,res) => {
    const {categoryName} = req.body
    const newCategory = await createCategory(req.user, categoryName)
    res.status(200).json({
        response: `Category: ${newCategory.categoryName} was created successfully!`
    })
})

const toggleCategoryActivity = asyncHandler(async(req, res) => {
    const {categoryId} = req.params
    await changeCatActivity(req.user, categoryId)
    res.status(200)
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
    req.status(200).json({response: "Category deleted successfully!"})
})

module.exports = {getAllCategories, createNewCategory, toggleCategoryActivity, editCategory, deleteCategoryController}