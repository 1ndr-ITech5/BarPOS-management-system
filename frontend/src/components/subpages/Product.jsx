import ProductRow from "../rows/ProductRow.jsx";
import "../../comp-style/subpages-style/Product.css";
import ProductModal from "../modals/ProductModal.jsx";
import {useState} from "react";

const Product = ({allCategories, allProducts}) => {

    const [tab, setTab] = useState("active")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [productModal, setProductModal] = useState(false)

    const shownProducts = allProducts.filter(product => 
        tab === "active" ? product.isArchived === false : product.isArchived === true
    )

    //filter by their choosen category
    const filteredProducts = shownProducts.filter(product => 
        categoryFilter === "all" ? product : product.categoryId.categoryName === categoryFilter
    )

    return (
        <div>
            <div>
                <button onClick={() => setTab("active")}>Active</button>
                <button onClick={() => setTab("archived")}>Archived</button>
            </div>
            <div className="categories-filter">
                <button onClick={() => setCategoryFilter("all")}>All</button>
                {allCategories.map(category => 
                    <button key={category._id} onClick={() => setCategoryFilter(category.categoryName)}>
                        {category.categoryName}</button>
                )}
            </div>
            <button onClick={() => setProductModal(true)}>Create New Product</button>
            <div className="table-container">
                <div className="table-header">
                    <h3>{tab === "active" ? "Active" : "Archived"} products</h3>
                    <span>{filteredProducts.length} products</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Available</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product, index) => (
                            <ProductRow key={product._id} product={product} index={index} categories={allCategories}/>
                        ))}
                    </tbody>
                </table>
            </div>
            {productModal ? <ProductModal categories={allCategories} goBack={setProductModal}/> : ""}
        </div>
    )
}

export default Product;