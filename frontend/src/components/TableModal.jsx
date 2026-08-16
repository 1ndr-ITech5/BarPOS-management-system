import {useDispatch, useSelector} from "react-redux";
import {setTableModal, setWarningModal} from "../store/slices/modalSlice.js";
import {useCreateOrderMutation} from "../store/apis/orderApi.js";
import {useNavigate} from "react-router-dom";
import {setCurrentOrder} from "../store/slices/orderSlice.js";
import {useGetOrderQuery} from "../store/apis/orderApi.js";

const TableModal = ({selectedTableId, allTables}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const table = allTables.find(t => t._id === selectedTableId)

    const [createOrder, {isloading}] = useCreateOrderMutation();
    const {data: orderData, isLoading: orderLoading} = useGetOrderQuery(table._id, {skip: !table._id})
    console.log(orderData)

    const user = useSelector((state) => state.user.user)


    const handleOpenOrder = async(e, table) => {
        e.preventDefault();

        try{
            const orderResponse = await createOrder({tableId: table._id}).unwrap()
            dispatch(setTableModal(false))
            dispatch(setCurrentOrder(orderResponse.createdOrder._id))
            navigate("/order-page")
        }catch(error){
            console.log(error)
        }
    }

    const handleUpdateOrder = (e) => {
        e.preventDefault();

        try{
            dispatch(setTableModal(false))
            console.log(orderData)
            dispatch(setCurrentOrder(orderData.order._id))
            navigate("/order-page")
        }catch(error){
            console.log(error)
        }
    }
 
    const handleWarning = () => {
        dispatch(setTableModal(false))
        dispatch(setWarningModal(true))
    }

    const backToTables = () => {
        dispatch(setTableModal(false))
        localStorage.removeItem("currentTableId")
    }

    return (
        <div className="table-modal">
            <h3>Table no.{table.tableNumber}</h3>
            <p style={{color: table.status === "available" ? "green" : "red"}}>Status: {table.status}</p>
            {table.status === "available" ?
                (<button onClick={(e) => user ? handleOpenOrder(e, table) : handleWarning()}>Open Table</button>)
            :
                (<>
                    <button onClick={(e) => user ? handleUpdateOrder(e) : handleWarning()}>Update Table</button>
                    <button>Checkout</button>
                </>)
            }
            <button onClick={() => backToTables()}>Back</button>
        </div>
    )
}

export default TableModal;