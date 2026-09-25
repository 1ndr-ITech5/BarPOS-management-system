import "../../comp-style/orderPage-style/Products.css";

const Products = ({menuItems, selectedCategory, addProduct, orderId}) => {

    return (
        <div>
            <h1>Products</h1>
            <div className="products">
            {selectedCategory === "All" ? menuItems.map((product) => 
            <button key={product._id} onClick={(e) => addProduct(e, orderId, product._id)}>{product.productName}</button>)
             : menuItems.filter((product) => product.category === selectedCategory).map((product) => 
             <button key={product._id} onClick={(e) => addProduct(e, orderId, product._id)}>{product.productName}</button>)}
             </div>
        </div>
    )
}

export default Products;