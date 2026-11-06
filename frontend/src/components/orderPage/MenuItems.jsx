import {useAddItemMutation} from "../../store/apis/orderItemsApi.js";
import {useGetProductsQuery} from "../../store/apis/productsApi.js";
import Spinner from "../other/Spinner.jsx";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import "../../comp-style/orderPage-style/Products.css";

const MenuItems = ({selectedCategory}) => {

    const orderId = useSelector(state => state.order.currentOrderId)

    const {data: menuItems, isLoading} = useGetProductsQuery();
    const [addItem, {isLoading: addingItem}] = useAddItemMutation();

    if (isLoading){
        return (
            <div>
                <h3>Loading items...</h3>
                <Spinner/>
            </div>
        )
    }

    const handleAddItem = async(orderId, menuItemId) => {
        try{
            await addItem({orderId, menuItemId}).unwrap()
        }catch(error){
            toast.error(error?.data?.message || "Item was not added on the order!")
        }
    }

    return (
        <div>
            <h1>Products</h1>
            <div className="products">
            {selectedCategory === "All" ? menuItems.map((product) => 
                <button key={product._id} onClick={() => handleAddItem(orderId, product._id)}
                disabled={!product.categoryId.isActive || addingItem}>{product.productName}</button>)
            : menuItems.filter((product) => product.categoryId?.categoryName === selectedCategory).map((product) => 
                <button key={product._id} onClick={() => handleAddItem(orderId, product._id)}
                disabled={!product.categoryId.isActive || addingItem}>{product.productName}</button>)}
             </div>
        </div>
    )
}

export default MenuItems;