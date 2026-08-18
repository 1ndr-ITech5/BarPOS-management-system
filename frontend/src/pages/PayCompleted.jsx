import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {clearCurrentOrder} from "../store/slices/orderSlice.js";
import {setViewReceipt} from "../store/slices/modalSlice.js";
import ViewReceipt from "../components/ViewReceipt.jsx";

const PayCompleted = () => {

    const nav = useNavigate();
    const dispatch = useDispatch();

    const receiptModal = useSelector(state => state.modals.receiptModal)

    const backToTables = () => {
        dispatch(clearCurrentOrder())
        nav("/tables")
    }

    return(
        <div>
            <h1>Payment Completed Successfully✅</h1>
            <div>
                <button onClick={() => dispatch(setViewReceipt(true))}>View Receipt</button>
                <button onClick={() => backToTables()}>Back to Main Page</button>
            </div>
            {receiptModal && <ViewReceipt/>}
        </div>
    )
}

export default PayCompleted;