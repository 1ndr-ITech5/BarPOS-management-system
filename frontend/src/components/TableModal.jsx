import {useDispatch, useSelector} from "react-redux";
import {setTableModal, setWarningModal} from "../store/slices/modalSlice.js";
import {useNavigate} from "react-router-dom";

const TableModal = ({table}) => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const user = useSelector((state) => state.user.user)

    const handleWarning = () => {
        dispatch(setTableModal(false))
        dispatch(setWarningModal(true))
    }

    return (
        <div className="table-modal">
            <h3>Table no.{table.tableNumber}</h3>
            <p style={{color: table.status === "available" ? "green" : "red"}}>Status: {table.status}</p>
            {table.status === "available" ?
                (<button onClick={() => user ? navigate("/order-page") : handleWarning()}>Open Table</button>)
            :
                (<>
                    <button onClick={() => user ? navigate("/order-page") : handleWarning()}>Update Table</button>
                    <button>Checkout</button>
                </>)
            }
            <button onClick={() => dispatch(setTableModal(false))}>Back</button>
        </div>
    )
}

export default TableModal;