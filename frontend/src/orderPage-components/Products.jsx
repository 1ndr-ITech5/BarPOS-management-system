const Products = ({menuItems, selectedCategory, addProduct}) => {
    return (
        <div>
            <h1>Products</h1>
            {selectedCategory === "All" ? menuItems.map((product) => 
            <button key={product.id} onClick={() => addProduct(product)}>{product.name}</button>)
             : menuItems.filter((product) => product.category === selectedCategory).map((product) => 
             <button key={product.id} onClick={() => addProduct(product)}>{product.name}</button>)}
        </div>
    )
}

export default Products;