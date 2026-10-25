import '../../comp-style/cards-style/TableCard.css';
import {useCreateOrderMutation, useLazyGetOrderByTableQuery} from "../../store/apis/orderApi.js";
import {useDeleteTableMutation} from "../../store/apis/tablesApi.js";
import {setCurrentOrder} from "../../store/slices/orderSlice.js";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setTableModal, setTableforUpdate} from "../../store/slices/modalSlice.js";
import {setPreBill} from "../../store/slices/orderSlice.js";
import {toast} from "react-toastify";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineUpdate } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { TfiWrite } from "react-icons/tfi";


const TableCard = ({table, setOrder}) => {

    const dispatch = useDispatch()
    const nav = useNavigate()

    const [createOrder, {isLoading: processLoading}] = useCreateOrderMutation();
    const [getOrderByTable, {isLoading: orderLoading}] = useLazyGetOrderByTableQuery();
    const [deleteTable, {isLoading: deletingTable}] = useDeleteTableMutation();

    const loading = () => {
        if (table.status === "available")
        {
            return processLoading
        }else{
            return orderLoading
        }
    }

    const handleOpenOrder = async() => {
        try{
            const orderResponse = await createOrder({tableId: table._id}).unwrap()
            dispatch(setCurrentOrder(orderResponse.createdOrder._id))
            toast.success(orderResponse.response)
            nav("/order-page")
        }catch(error){
            toast.error(error)
        }
    }

    const handleGetOrder = async() => {
        try {
            const orderData = await getOrderByTable(table._id).unwrap()
            setOrder(orderData)
            dispatch(setPreBill(orderData.order._id))
        } catch (error) {
            toast.error(error?.data?.message || "You are not authorized to access this order.")
        }
    }

    const handleUpdateOrder = async() => {
        try {
            const response = await getOrderByTable(table._id).unwrap()
            dispatch(setCurrentOrder(response.order._id))
            nav("/order-page")
        } catch (error) {
            toast.error(error?.data?.message || "You are not authorized to access this order.")
        }
    }
    
    const handleCheckout = async () => {
        try {
            const response = await getOrderByTable(table._id).unwrap()
            dispatch(setCurrentOrder(response.order._id))
            nav("/checkout")
        } catch (error) {
            toast.error(error?.data?.message || "You are not authorized to access this order.")
        }
    }

    const handleDeleteTable = async() => {
        try {
            const response = await deleteTable(table._id).unwrap()
            toast.success(response.response)
        }catch(error){
            toast.error(error)
        }
    }

    return(
        <div className={`table-card ${table.status}`}>
            <div className="table-card-header">
                <h3>Table: <span>{table.tableName}</span></h3>
                {table.status === "available" ? <button onClick={() => handleDeleteTable()} disabled={deletingTable}>
                    <RiDeleteBinLine /></button> : ""}
                {table.status === "occupied" ? <button onClick={() => handleCheckout()} disabled={loading()}>
                    <MdOutlineShoppingCartCheckout /></button> : ""}
            </div>
            <button className="table-status">{table.status}</button>
            <div className="table-card-stats">
                <div>
                    <h4>Size:</h4>
                    <h4>{table.capacity <= 5 ? "Small" : table.capacity >= 8 ? "Large" : "Medium"}</h4>
                </div>
                <div>
                    <h4>Capacity:</h4>
                    <h4>{table.capacity} people</h4>
                </div>
            </div>
            <div className="table-actions">
                <button onClick={() => {table.status === "available" ? handleOpenOrder() : handleUpdateOrder()}} disabled={loading()}>
                {table.status === "available" ? <IoMdAdd /> : <MdOutlineUpdate />}
                {table.status === "available" ? "Open Order" : "Update Order"}</button>
                {table.status === "available" ? <button onClick={() => {dispatch(setTableforUpdate(table._id)), dispatch(setTableModal())}}>
                    <TfiWrite /> Update Table</button> : ""}
                {table.status === "occupied" ? <button onClick={() => handleGetOrder()} disabled={loading()}><GrView /> View Order</button> : ""}
            </div>
        </div>
    )
}

export default TableCard;