import {useDispatch, useSelector} from "react-redux";
import {setTableModal, setWarningModal} from "../store/slices/modalSlice.js";
import {useCreateOrderMutation} from "../store/apis/orderApi.js";
import {useNavigate} from "react-router-dom";
import {setCurrentOrder} from "../store/slices/orderSlice.js";

const TableModal = ({selectedTable, allTables}) => {

    const [createOrder, {isloading}] = useCreateOrderMutation();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const user = useSelector((state) => state.user.user)

    const table = allTables.find(t => t._id === selectedTable._id)

    const handleOpenOrder = async(e, table) => {
        e.preventDefault();

        try{
            const orderResponse = await createOrder({tableId: table._id}).unwrap()
            dispatch(setTableModal(false))
            dispatch(setCurrentOrder(orderResponse._id))
            navigate("/order-page")
        }catch(error){
            console.log(error)
        }
    }  

    const handleWarning = () => {
        dispatch(setTableModal(false))
        dispatch(setWarningModal(true))
    }

    return (
        <div className="table-modal">
            <h3>Table no.{table.tableNumber}</h3>
            <p style={{color: table.status === "available" ? "green" : "red"}}>Status: {table.status}</p>
            {table.status === "available" ?
                (<button onClick={(e) => user ? handleOpenOrder(e, table) : handleWarning()}>Open Table</button>)
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