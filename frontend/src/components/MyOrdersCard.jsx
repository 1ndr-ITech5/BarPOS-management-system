import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setCurrentOrder} from "../store/slices/orderSlice.js";
import {setSelectedTable} from "../store/slices/modalSlice.js";
import {useSelector} from "react-redux";

const MyOrdersCard = ({order}) => {

    const dispatch = useDispatch();
    const nav = useNavigate();

    const user = useSelector(state => state.user.user)

    const createdTime = new Date(order.createdAt)
    const timeNow = new Date()
    
    const difference = Math.floor((timeNow - createdTime) / 1000)
    
    const minutes = Math.floor(difference / 60)
    const hours = Math.floor(difference / 3600)

    const handleUpdateOrder = (e) => {
        e.preventDefault();
    
        try{
            dispatch(setSelectedTable(order.tableId._id))
            dispatch(setCurrentOrder(order._id))
            nav("/order-page")
        }catch(error){
            console.log(error)
        }
    }

    return(
        <div className="myorder-card">
            <h2>Table No. {order.tableId.tableNumber}</h2>
            <h3>{user.role === "admin" ? `Opened by: ${order.waiterId.first_name} ${order.waiterId.last_name}` : ``}</h3>
            <h3>Opened: {minutes < 1 ? "now" : (minutes < 60 ? minutes : hours)} {minutes < 1 ? "" : (minutes < 60 ? "minutes ago" : "hours ago")}</h3>
            <h3>Total: {order.total} ALL</h3>
            <div>
                <button onClick={(e) => handleUpdateOrder(e)}>Update Order</button>
                <button onClick={() => nav("/checkout")}>Checkout</button>
            </div>
        </div>
    )
}

export default MyOrdersCard;