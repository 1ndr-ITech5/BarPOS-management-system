import "../orderPage-style/Products.css";

const Products = ({menuItems, selectedCategory, addProduct}) => {
    return (
        <div>
            <h1>Products</h1>
            <div className="products">
            {selectedCategory === "All" ? menuItems.map((product) => 
            <button key={product._id} onClick={() => addProduct(product)}>{product.productName}</button>)
             : menuItems.filter((product) => product.category === selectedCategory).map((product) => 
             <button key={product._id} onClick={() => addProduct(product)}>{product.productName}</button>)}
             </div>
        </div>
    )
}

export default Products;