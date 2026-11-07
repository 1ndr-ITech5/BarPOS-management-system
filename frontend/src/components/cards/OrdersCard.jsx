import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setCurrentOrder} from "../../store/slices/orderSlice.js";
import {setPreBill} from "../../store/slices/orderSlice.js";
import {TimeReform} from "../../utils/DateFormat.js";
import {toast} from "react-toastify";

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
        <div className="myorder-card">
            <h2>Table No. {order.tableId.tableNumber}</h2>
            <h3>{user.role === "admin" ? `Opened by: ${order.waiterId.first_name} ${order.waiterId.last_name}` : ``}</h3>
            <h3>Opened: {TimeReform(order.createdAt)}</h3>
            <h3>Total: {order.total} ALL</h3>
            <div>
                <button onClick={handleUpdateOrder}>Update Order</button>
                <button onClick={handleCheckout}>Checkout</button>
                <button onClick={() => handleSetOrderPreBill(order)}>View</button>
            </div>
        </div>
    )
}

export default OrdersCard;