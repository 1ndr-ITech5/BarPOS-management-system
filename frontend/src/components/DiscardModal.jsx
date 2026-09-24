import {useDeleteOrderMutation} from "../store/apis/orderApi.js";
import { toast } from "react-toastify";

const DiscardModal = ({changeDiscardModal, setShowDiscard, tableId}) => {

    const [deleteOrder] = useDeleteOrderMutation();

    const handleDeleteOrder = async(e) => {
        e.preventDefault();

        try{
            const response = await deleteOrder(tableId).unwrap()
            toast.success(response.response)
            changeDiscardModal()
        }catch(error){
            toast.error(error)
        }
    }

    return(
        <div className="discard">
            <h2>Do you want to discard changes?</h2>
            <div className="buttons">
                <button onClick={(e) => handleDeleteOrder(e)}>Yes</button>
                <button onClick={() => setShowDiscard(false)}>No</button>
            </div>
        </div>
    )
}

export default DiscardModal;