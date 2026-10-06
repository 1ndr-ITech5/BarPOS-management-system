import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setCurrentOrder} from "../../store/slices/orderSlice.js";
import {TimeReform} from "../../utils/DateFormat.js";
import {useSelector} from "react-redux";

const MyOrdersCard = ({order}) => {

    const dispatch = useDispatch();
    const nav = useNavigate();

    const user = useSelector(state => state.user.user)

    const handleUpdateOrder = (e) => {
        e.preventDefault();
    
        try{
            dispatch(setCurrentOrder(order._id))
            nav("/order-page")
        }catch(error){
            console.log(error)
        }
    }

    const handleCheckout = (e) => {
        e.preventDefault();

        try{
            dispatch(setCurrentOrder(order._id))
            nav("/checkout")
        }catch(error){
            console.log(error)
        }
    }

    return(
        <div className="myorder-card">
            <h2>Table No. {order.tableId.tableNumber}</h2>
            <h3>{user.role === "admin" ? `Opened by: ${order.waiterId.first_name} ${order.waiterId.last_name}` : ``}</h3>
            <h3>Opened: {TimeReform(order.createdAt)}</h3>
            <h3>Total: {order.total} ALL</h3>
            <div>
                <button onClick={(e) => handleUpdateOrder(e)}>Update Order</button>
                <button onClick={(e) => handleCheckout(e)}>Checkout</button>
            </div>
        </div>
    )
}

export default MyOrdersCard;