import { IoMdAdd } from "react-icons/io";
import {useState} from "react";
import "../../comp-style/subpages-style/Category.css";
import CategoryModal from "../modals/CategoryModal.jsx";
import CategoryRow from "../rows/CategoryRow.jsx";

const Category = ({allCategories, allProducts}) => {

    const [modal, setModal] = useState(false)
    const [tab, setTab] = useState("active")

    const shownCategories = allCategories.filter(
        tab === "active" ? category => category.isArchived === false : category => category.isArchived === true
    );

    const countProducts = (categoryId) =>
        allProducts.filter(product => product.categoryId?._id === categoryId).length

    return (
        <div className="category-subpage">
            <div className="tabs">
                <button className={tab === "active" ? "tab-active" : "tab"} onClick={() => setTab("active")}>Active</button>
                <button className={tab === "archived" ? "tab-active" : "tab"} onClick={() => setTab("archived")}>Archived</button>
            </div>
            <div className="category-table-container">
                <div className="table-header">
                    <span>{shownCategories.length} categories</span>
                    <button onClick={() => setModal(true)}><IoMdAdd /> Create Category</button>
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
            {modal && 
            <div className="modal">
                <CategoryModal goBack={setModal}/>
            </div>}
        </div>
    )
}

export default Category;