import {useDeleteOrderMutation} from "../store/apis/orderApi.js";
import {useDispatch} from "react-redux";

const DiscardModal = ({changeDiscardModal, setShowDiscard, tableId}) => {

    const [deleteOrder] = useDeleteOrderMutation();

    const handleDeleteOrder = async(e) => {
        e.preventDefault();

        try{
            const response = await deleteOrder(tableId).unwrap()
            console.log(response)
            changeDiscardModal()
        }catch(error){
            console.log(error)
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