import {useGetOrderByIdQuery} from "../../store/apis/orderApi.js";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setCurrentOrder} from "../../store/slices/orderSlice.js";
import {setPreBill} from "../../store/slices/orderSlice.js";
import {TimeReform} from "../../utils/DateFormat.js";
import PreBill from "../other/PreBill.jsx";

const MyOrdersCard = ({order}) => {

    const dispatch = useDispatch();
    const nav = useNavigate();

    const user = useSelector(state => state.user.user)
    const preBillOrderId = useSelector(state => state.order.preBillOrderId)
    const viewPreBill = preBillOrderId === order._id

    const {data: orderData} = useGetOrderByIdQuery(order._id, {skip: !viewPreBill});

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
                <button onClick={() => dispatch(setPreBill(order._id))}>View</button>
            </div>
            <div>
                {viewPreBill && orderData && <PreBill orderData={orderData}/>}
            </div>
        </div>
    )
}

export default MyOrdersCard;