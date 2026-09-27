import {useDispatch} from "react-redux";
import {setTableModal} from "../../store/slices/modalSlice.js";
import {useCreateOrderMutation} from "../../store/apis/orderApi.js";
import {useNavigate} from "react-router-dom";
import {setCurrentOrder} from "../../store/slices/orderSlice.js";
import {removeSelectedTable} from "../../store/slices/modalSlice.js";
import {useLazyGetOrderQuery} from "../../store/apis/orderApi.js";
import { toast } from "react-toastify";

const TableModal = ({selectedTableId, allTables}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [createOrder] = useCreateOrderMutation();

    const table = allTables.find(t => t._id === selectedTableId)
    const [getOrder, {isLoading: orderLoading}] = useLazyGetOrderQuery()

    if(!table){
        return (
            <div>
                <p>Table was not found!</p>
                <button onClick={() => {dispatch(removeSelectedTable()), navigate("/tables")}}>Back</button>
            </div>
        )
    }

    const handleOpenOrder = async(e, table) => {
        e.preventDefault();

        try{
            const orderResponse = await createOrder({tableId: table._id}).unwrap()
            dispatch(setTableModal(false))
            dispatch(setCurrentOrder(orderResponse.createdOrder._id))
            toast.success(orderResponse.response)
            navigate("/order-page")
        }catch(error){
            toast.error(error)
        }
    }

    const handleUpdateOrder = async(e) => {
        e.preventDefault();

        try {
            const response = await getOrder(table._id).unwrap()
            dispatch(setTableModal(false))
            dispatch(setCurrentOrder(response.order._id))
            navigate("/order-page")
        } catch (error) {
            toast.error(error?.data?.message || "You are not authorized to access this order.")
        }
    }

    const handleCheckout = async () => {
        try {
            const response = await getOrder(table._id).unwrap()
            dispatch(setCurrentOrder(response.order._id))
            navigate("/checkout")
        } catch (error) {
            toast.error(error?.data?.message || "You are not authorized to access this order.")
        }
    }

    const backToTables = () => {
        dispatch(setTableModal(false))
        dispatch(removeSelectedTable())
    }

    return (
        <div className="table-modal">
            <h3>Table no.{table.tableNumber}</h3>
            <p style={{color: table.status === "available" ? "green" : "red"}}>Status: {table.status}</p>
            {table.status === "available" ?
                (<button onClick={(e) => handleOpenOrder(e, table)}>Open Table</button>)
            :
                (<>
                    <button onClick={handleUpdateOrder} disabled={orderLoading}>{orderLoading ? "Checking..." : "Update Table"}</button>
                    <button onClick={handleCheckout} disabled={orderLoading}>{orderLoading ? "Checking..." : "Checkout"}</button>
                </>)
            }
            <button onClick={() => backToTables()}>Back</button>
        </div>
    )
}

export default TableModal;