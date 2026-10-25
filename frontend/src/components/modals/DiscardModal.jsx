import {useDeleteOrderMutation} from "../../store/apis/orderApi.js";
import {setDiscardModal} from "../../store/slices/modalSlice.js";
import {clearCurrentOrder} from "../../store/slices/orderSlice.js";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import { toast } from "react-toastify";

const DiscardModal = ({tableId}) => {
    const nav = useNavigate();
    const dispatch = useDispatch();

    const [deleteOrder, {isLoading}] = useDeleteOrderMutation();

    const handleDeleteOrder = async() => {
        try{
            const response = await deleteOrder(tableId).unwrap()
            toast.success(response.response)
            dispatch(setDiscardModal(false))
            dispatch(clearCurrentOrder())
            nav("/tables")
        }catch(error){
            toast.error(error)
        }
    }

    return(
        <div className="discard">
            <h2>Do you want to discard changes?</h2>
            <div className="buttons">
                <button onClick={handleDeleteOrder} disabled={isLoading}>Yes</button>
                <button onClick={() => dispatch(setDiscardModal(false))} disabled={isLoading}>No</button>
            </div>
        </div>
    )
}

export default DiscardModal;