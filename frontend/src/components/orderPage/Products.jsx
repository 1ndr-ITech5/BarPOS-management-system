import "../../comp-style/orderPage-style/Products.css";
import {useGetProductsQuery} from "../../store/apis/productsApi.js";
import Spinner from "../other/Spinner.jsx";

const Products = ({selectedCategory, addProduct, orderId}) => {
    const {data: menuItems, isLoading} = useGetProductsQuery();

    if (isLoading){
        return (
            <div>
                <h3>Loading items...</h3>
                <Spinner/>
            </div>
        )
    }

    return (
        <div>
            <h1>Products</h1>
            <div className="products">
            {selectedCategory === "All" ? menuItems.map((product) => 
                <button key={product._id} onClick={(e) => addProduct(e, orderId, product._id)}
                disabled={!product.isAvailable}>{product.productName}</button>)
            : menuItems.filter((product) => product.categoryId?.categoryName === selectedCategory).map((product) => 
                <button key={product._id} onClick={(e) => addProduct(e, orderId, product._id)}
                disabled={!product.isAvailable}>{product.productName}</button>)}
             </div>
        </div>
    )
}

export default Products;