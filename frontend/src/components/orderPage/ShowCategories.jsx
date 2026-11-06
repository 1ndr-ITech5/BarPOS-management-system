import {useGetCategoriesQuery} from "../../store/apis/categoryApi.js";
import Spinner from "../other/Spinner.jsx";
import "../../comp-style/orderPage-style/Categories.css";

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
        <div>
            <h1>Categories</h1>
            <div className="categories">
                <button onClick={() => setCategory("All")}>All</button>
                {categories.map(category => (
                    category.isArchived ? "" : 
                    <button key={category._id} 
                    className={selectedCategory === category.categoryName ? "selectedCategory" : "otherCategory"}
                    onClick={() => setCategory(category.categoryName)} disabled={!category.isActive}>
                        {category.categoryName}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Categories;