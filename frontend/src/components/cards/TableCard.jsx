import '../../comp-style/cards-style/TableCard.css';
import {useCreateOrderMutation, useLazyGetOrderByTableQuery} from "../../store/apis/orderApi.js";
import {setCurrentOrder, setViewOrder} from "../../store/slices/orderSlice.js";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const TableCard = ({table, setOrder}) => {

    const dispatch = useDispatch()
    const nav = useNavigate()

    const [createOrder, {isLoading: processLoading}] = useCreateOrderMutation();
    const [getOrderByTable, {isLoading: orderLoading}] = useLazyGetOrderByTableQuery();

    const loading = () => {
        if (table.status === "available")
        {
            return processLoading
        }else{
            return orderLoading
        }
    }

    const handleOpenOrder = async() => {
        try{
            const orderResponse = await createOrder({tableId: table._id}).unwrap()
            dispatch(setCurrentOrder(orderResponse.createdOrder._id))
            toast.success(orderResponse.response)
            nav("/order-page")
        }catch(error){
            toast.error(error)
        }
    }

    const handleGetOrder = async() => {
        try {
            const response = await getOrderByTable(table._id).unwrap()
            setOrder(response)
            dispatch(setViewOrder(true))
        } catch (error) {
            toast.error(error?.data?.message || "You are not authorized to access this order.")
        }
    }

    const handleUpdateOrder = async() => {
        try {
            const response = await getOrderByTable(table._id).unwrap()
            dispatch(setCurrentOrder(response.order._id))
            nav("/order-page")
        } catch (error) {
            toast.error(error?.data?.message || "You are not authorized to access this order.")
        }
    }
    
    const handleCheckout = async () => {
        try {
            const response = await getOrderByTable(table._id).unwrap()
            dispatch(setCurrentOrder(response.order._id))
            nav("/checkout")
        } catch (error) {
            toast.error(error?.data?.message || "You are not authorized to access this order.")
        }
    }

    return(
        <div className="table-card" style={{backgroundColor: table.status === "available" ? "green" : "red"}}>
            <h3>Table: {table.tableNumber}</h3>
            <h4>Seats | {table.capacity}</h4>
            <button className="table-status">{table.status}</button>
            <div className="table-actions">
                <button onClick={() => {table.status === "available" ? handleOpenOrder() : handleUpdateOrder()}} disabled={loading()}>
                {table.status === "available" ? "Open Order" : "Update Order"}</button>
                {table.status === "occupied" ? <button onClick={() => handleGetOrder()} disabled={loading()}>View Order</button> : ""}
                {table.status === "occupied" ? <button onClick={() => handleCheckout()} disabled={loading()}>Checkout</button> : ""}
            </div>
        </div>
    )
}

export default TableCard;