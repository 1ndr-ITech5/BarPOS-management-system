import "../../comp-style/orderPage-style/Categories.css";

const Categories = ({menuItems, selectedCategory, setCategory}) => {

    const categories = ["All", ...new Set(menuItems.map((item) => item.categoryId?.categoryName))]

    return (
        <div>
            <h1>Categories</h1>
            <div className="categories">
                {categories.map(category => (
                    <button key={category} className={selectedCategory === category ? "selectedCategory" : "otherCategory"}
                    onClick={() => setCategory(category)}>
                        {category}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Categories;