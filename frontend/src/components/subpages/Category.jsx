import {useState} from "react";
import "../../comp-style/subpages-style/Category.css";
import CategoryModal from "../modals/CategoryModal.jsx";
import CategoryRow from "../other/CategoryRow.jsx";

const Category = ({allCategories, allProducts}) => {

    const [modal, setModal] = useState(false)
    const [tab, setTab] = useState("active")

    const shownCategories = allCategories.filter(
        tab === "active" ? category =>
            category.isActive === true && category.isArchived === false
            : category => category.isArchived === true
    );

    const countProducts = (categoryId) =>
        allProducts.filter(product => product.categoryId?._id === categoryId).length

    return (
        <div className="category-subpage">
            {modal ? <CategoryModal goBack={setModal}/>
            : <button onClick={() => setModal(true)}>Create New Category</button>}
            <div className="tabs">
                <button className={tab === "active" ? "tab-active" : "tab"} onClick={() => setTab("active")}>Active</button>
                <button className={tab === "archived" ? "tab-active" : "tab"} onClick={() => setTab("archived")}>Archived</button>
            </div>
            <div className="category-table-container">
                <div className="table-header">
                    <h3>{tab === "active" ? "Active" : "Archived"} Categories</h3>
                    <span>{shownCategories.length} categories</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Total Products</th>
                            <th>Available</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shownCategories.map((category, index) => (
                            <CategoryRow
                                key={category._id}
                                category={category}
                                index={index}
                                productCount={countProducts(category._id)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Category;