import { IoAddCircleOutline } from "react-icons/io5";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import {useSelector} from "react-redux";

const OrderItems = ({orderItems, addProduct, removeProduct}) => {

    const currentOrder = useSelector(state => state.order.currentOrderId)
    const orderTotal = orderItems.reduce((sum, item) => {return sum += (item.price * item.quantity)}, 0)

    return (
        <div>
            <h1>Order Items</h1>
            {orderItems.map((item) => 
                <div key={item.id}>
                    <p>{item.name} x{item.quantity}</p>
                    <IoAddCircleOutline onClick={(e) => addProduct(e, item)}/>
                    <IoIosRemoveCircleOutline onClick={(e) => removeProduct(e, item)}/>
                </div>
            )}
            <div className="items-total">
                <h2>{orderTotal} ALL</h2>
            </div>
        </div>
    )
}

export default OrderItems;