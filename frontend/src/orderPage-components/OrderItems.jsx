import { IoAddCircleOutline } from "react-icons/io5";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import {useSelector} from "react-redux";

const OrderItems = ({orderItems = [], addProduct, removeProduct}) => {

    const currentOrder = useSelector(state => state.order.currentOrderId)
    const orderTotal = orderItems.reduce((sum, item) => {return sum += (item.unitPrice * item.quantity)}, 0)

    return (
        <div>
            <h1>Order Items</h1>
            {orderItems.length > 0 ? (orderItems.map((item) => 
                <div key={item._id}>
                    <p>{item.menuItemId.productName} x{item.quantity}</p>
                    <IoAddCircleOutline onClick={(e) => addProduct(e, currentOrder, item.menuItemId._id)}/>
                    <IoIosRemoveCircleOutline onClick={(e) => removeProduct(e, currentOrder, item.menuItemId._id)}/>
                </div>
            )) : (
                <p>Add the first item on this order</p>
            )}
            <div className="items-total">
                <h2>{orderTotal} ALL</h2>
            </div>
        </div>
    )
}

export default OrderItems;