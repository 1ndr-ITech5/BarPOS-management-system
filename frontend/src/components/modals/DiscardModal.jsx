import {useDeleteOrderMutation, useGetOrderByIdQuery} from "../../store/apis/orderApi.js"
import {setDiscardModal} from "../../store/slices/modalSlice.js";
import {clearCurrentOrder} from "../../store/slices/orderSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../other/Spinner.jsx";

const DiscardModal = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();

    const orderId = useSelector(state => state.order.currentOrderId)
    const {data: order, isLoading: orderLoading} = useGetOrderByIdQuery(orderId);
    const [deleteOrder, {isLoading: deletingOrder}] = useDeleteOrderMutation();

    if(orderLoading){
        return (
            <div>
                <h1>Loading order...</h1>
                <Spinner />
            </div>
        )
    }

    const handleDeleteOrder = async(tableId) => {
        try{
            const response = await deleteOrder(tableId).unwrap()
            console.log(response)
            toast.success(response.response)
            dispatch(setDiscardModal(false))
            dispatch(clearCurrentOrder())
            nav("/tables")
        }catch(error){
            toast.error(error?.data?.message || "Order couldn't be deleted!")
        }
    }

    return(
        <div className="discard">
            <h2>Do you want to discard changes?</h2>
            <div className="buttons">
                <button onClick={() => handleDeleteOrder(order.tableId._id)} disabled={deletingOrder}>Yes</button>
                <button onClick={() => dispatch(setDiscardModal(false))} disabled={deletingOrder}>No</button>
            </div>
        </div>
    )
}

export default DiscardModal;