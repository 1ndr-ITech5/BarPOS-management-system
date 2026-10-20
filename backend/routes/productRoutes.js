const express = require("express")
const {getProducts, createProduct, editProduct, toggleProductActivity,
    deleteProduct, restoreProduct} = require("../controllers/productController.js")
const {protect} = require("../middlewares/authMiddleware.js")
const {adminOnly} = require("../middlewares/adminOnlyMiddleware.js")
const router = express.Router()

router.get("/", protect, getProducts)

router.post("/create", protect, adminOnly, createProduct)

router.patch("/edit/:productId", protect, adminOnly, editProduct)

router.patch("/toggle-activity/:productId", protect, adminOnly, toggleProductActivity)

router.delete("/delete/:productId", protect, adminOnly, deleteProduct)

router.patch("/restore/:productId", protect, adminOnly, restoreProduct)

module.exports = router;