import ProductRow from "../rows/ProductRow.jsx";
import "../../comp-style/subpages-style/Product.css";
import ProductModal from "../modals/ProductModal.jsx";
import { IoMdAdd } from "react-icons/io";
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
        <div className="product-subpage">
            <div className="tabs">
                <button className={tab === "active" ? "tab-active" : "tab"} onClick={() => setTab("active")}>Active</button>
                <button className={tab === "archived" ? "tab-active" : "tab"} onClick={() => setTab("archived")}>Archived</button>
            </div>
            <div className="categories-filter">
                <button className={categoryFilter === "all" ? "selected" : ""} onClick={() => setCategoryFilter("all")}>All</button>
                {allCategories.map(category => 
                    <button key={category._id} 
                        className={categoryFilter === category.categoryName ? "selected" : ""}
                        onClick={() => setCategoryFilter(category.categoryName)}>
                        {category.categoryName}
                    </button>
                )}
            </div>
            <div className="product-table-container">
                <div className="table-header">
                    <span>{filteredProducts.length} products</span>
                    <button onClick={() => setProductModal(true)}><IoMdAdd/> Create Product</button>
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
            {productModal && 
                <div className="modal">
                    <ProductModal categories={allCategories} goBack={setProductModal}/> : ""
                </div>}
        </div>
    )
}

export default Product;