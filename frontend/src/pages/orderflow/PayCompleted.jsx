import { FaCheckCircle } from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {clearCurrentOrder} from "../../store/slices/orderSlice.js";
import {setViewReceipt} from "../../store/slices/modalSlice.js";
import ViewReceipt from "../../components/other/ViewReceipt.jsx";
import "../../pages-style/orderflow/PayCompleted.css";

const PayCompleted = () => {

    const nav = useNavigate();
    const dispatch = useDispatch();

    const receiptModal = useSelector(state => state.modals.receiptModal)

    const backToTables = () => {
        dispatch(clearCurrentOrder())
        nav("/tables")
    }

    return (
        <>
            <div className="pay-completed">
                <FaCheckCircle />
                <h1>Payment Received!</h1>
                <div className="pay-buttons">
                    <button onClick={() => dispatch(setViewReceipt(true))}>View Receipt</button>
                    <button onClick={() => backToTables()}>Back to Main Page</button>
                </div>
            </div>
            {receiptModal && (
                <div className="receipt-panel">
                    <ViewReceipt/>
                </div>
            )}
        </>
    )
}

export default PayCompleted;