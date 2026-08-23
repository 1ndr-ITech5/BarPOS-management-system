import {useDispatch, useSelector} from "react-redux";
import {setTableModal, setWarningModal} from "../store/slices/modalSlice.js";
import {useCreateOrderMutation} from "../store/apis/orderApi.js";
import {useNavigate} from "react-router-dom";
import {setCurrentOrder} from "../store/slices/orderSlice.js";
import {removeSelectedTable} from "../store/slices/modalSlice.js";
import {useGetOrderQuery} from "../store/apis/orderApi.js";

const TableModal = ({selectedTableId, allTables}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [createOrder] = useCreateOrderMutation();
    const user = useSelector((state) => state.user.user)

    const table = allTables.find(t => t._id === selectedTableId)
    const {data: orderData} = useGetOrderQuery(table?._id, {skip: !table?._id})

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
            navigate("/order-page")
        }catch(error){
            console.log(error)
        }
    }

    const handleUpdateOrder = (e) => {
        e.preventDefault();

        try{
            dispatch(setTableModal(false))
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
        dispatch(removeSelectedTable())
    }

    const handleCheckout = () => {
        dispatch(setCurrentOrder(orderData.order._id))
        navigate("/checkout")
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
                    <button onClick={() => handleCheckout()}>Checkout</button>
                </>)
            }
            <button onClick={() => backToTables()}>Back</button>
        </div>
    )
}

export default TableModal;