import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setCurrentOrder} from "../../store/slices/orderSlice.js";
import {setPreBill} from "../../store/slices/orderSlice.js";
import {TimeReform} from "../../utils/DateFormat.js";
import {toast} from "react-toastify";
import "../../comp-style/cards-style/OrderCard.css";

const OrdersCard = ({order, setOrder}) => {

    const dispatch = useDispatch();
    const nav = useNavigate();

    const user = useSelector(state => state.user.user)

    const handleUpdateOrder = () => {
        try{
            dispatch(setCurrentOrder(order._id))
            nav("/order-page")
        }catch(error){
            toast.error(error)
        }
    }

    const handleCheckout = () => {
        try{
            dispatch(setCurrentOrder(order._id))
            nav("/checkout")
        }catch(error){
            toast.error(error)
        }
    }

    const handleSetOrderPreBill = (selectedOrder) => {
        setOrder(selectedOrder)
        dispatch(setPreBill(true))
    }

    return(
        <div className="order-card">
            <div className="order-info">
                <h3>Table: <span>{order.tableId.tableName}</span></h3>
                {user.role === "admin" && (
                    <h3>
                        Opened By: <span>{order.waiterId?.first_name} {order.waiterId?.last_name}</span>
                    </h3>
                )}
                <h3>Time Opened: <span>{TimeReform(order.createdAt)}</span></h3>
                <h3>Order Total: <span>{order.total} ALL</span></h3>
            </div>
            <div className="card-actions">
                <button onClick={handleUpdateOrder}>Update Order</button>
                <button onClick={handleCheckout}>Checkout</button>
                <button onClick={() => handleSetOrderPreBill(order)}>View Order</button>
            </div>
        </div>
    )
}

export default OrdersCard;