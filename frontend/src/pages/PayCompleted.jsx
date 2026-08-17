import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {clearCurrentOrder} from "../store/slices/orderSlice.js";

const PayCompleted = () => {

    const nav = useNavigate();
    const dispatch = useDispatch();

    const backToTables = () => {
        dispatch(clearCurrentOrder())
        nav("/tables")
    }

    return(
        <div>
            <h1>Payment Completed Successfully✅</h1>
            <div>
                <button>View Receipt</button>
                <button onClick={() => backToTables()}>Back to Main Page</button>
            </div>
        </div>
    )
}

export default PayCompleted;