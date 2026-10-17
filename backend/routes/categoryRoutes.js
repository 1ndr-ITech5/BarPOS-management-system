const express = require("express")
const {getAllCategories, createNewCategory, toggleCategoryActivity, 
    editCategory, deleteCategoryController} = require("../controllers/categoryController.js")
const {protect} = require("../middlewares/authMiddleware.js")
const {adminOnly} = require("../middlewares/adminOnlyMiddleware.js")
const router = express.Router()

router.get("/", protect, getAllCategories)

router.post("/create", protect, adminOnly, createNewCategory)

router.patch("/activity/:categoryId", protect, adminOnly, toggleCategoryActivity)

router.patch("/edit/:categoryId", protect, adminOnly, editCategory)

router.delete("/delete/:categoryId", protect, adminOnly, deleteCategoryController)

module.exports = router;