import {useNavigate} from "react-router-dom";

const PayCompleted = () => {

    const nav = useNavigate();

    return(
        <div>
            <h1>Payment Completed Successfully✅</h1>
            <div>
                <button>View Receipt</button>
                <button onClick={() => nav("/tables")}>Back to Main Page</button>
            </div>
        </div>
    )
}

export default PayCompleted;