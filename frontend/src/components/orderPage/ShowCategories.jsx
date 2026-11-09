import {useGetCategoriesQuery} from "../../store/apis/categoryApi.js";
import Spinner from "../other/Spinner.jsx";
import "../../comp-style/orderPage-style/OrderPanel.css";

const Categories = ({selectedCategory, setCategory}) => {
    const {data: categories, isLoading} = useGetCategoriesQuery();

    if(isLoading){
        return (
            <div>
                <h3>Loading categories...</h3>
                <Spinner/>
            </div>
        )
    }

    return (
        <div className="order-panel categories-panel">
            <h1>Categories</h1>
            <div className="panel-list">
                <button className={selectedCategory === "All" ? "selected" : ""} 
                    onClick={() => setCategory("All")}>All</button>

                {categories.filter(category => !category.isArchived).map(category => (
                    <button key={category._id}
                        className={selectedCategory === category.categoryName ? "selected" : ""}
                        onClick={() => setCategory(category.categoryName)}
                        disabled={!category.isActive}>
                        {category.categoryName}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Categories;