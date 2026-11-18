import {useAddItemMutation} from "../../store/apis/orderItemsApi.js";
import {useGetProductsQuery} from "../../store/apis/productsApi.js";
import Spinner from "../other/Spinner.jsx";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import "../../comp-style/orderPage-style/OrderPanel.css";

const MenuItems = ({selectedCategory}) => {

    const orderId = useSelector(state => state.order.currentOrderId)

    const {data: menuItems = [], isLoading} = useGetProductsQuery();
    const [addItem, {isLoading: addingItem}] = useAddItemMutation();

    const hasItems = menuItems?.length > 0;

    if (isLoading){
        return (
            <div>
                <h3>Loading items...</h3>
                <Spinner/>
            </div>
        )
    }

    const shownProducts = selectedCategory === "All"
        ? menuItems
        : menuItems.filter(product => product.categoryId?.categoryName === selectedCategory)

    const handleAddItem = async(menuItemId) => {
        try{
            await addItem({orderId, menuItemId}).unwrap()
        }catch(error){
            toast.error(error?.data?.message || "Item was not added on the order!")
        }
    }

    return (
        <div className="order-panel products-panel">
            <h1>Products</h1>
            {hasItems ? (
                <div className="panel-list">
                    {shownProducts.map(product => (
                        <button
                            key={product._id}
                            onClick={() => handleAddItem(product._id)}
                            disabled={!product.categoryId?.isActive || addingItem}>
                            {product.productName}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="no-found">
                    <h3>No products were found!</h3>
                </div>
            )}
        </div>
    )
}

export default MenuItems;