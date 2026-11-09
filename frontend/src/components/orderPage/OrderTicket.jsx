import {useGetItemsQuery, useAddItemMutation, 
    useRemoveItemMutation, useDeleteItemMutation} from "../../store/apis/orderItemsApi.js";
import {useGetOrderByIdQuery} from "../../store/apis/orderApi.js";
import {setDiscardModal} from "../../store/slices/modalSlice.js";
import {clearCurrentOrder} from "../../store/slices/orderSlice.js";
import {formatDate, formatTime} from "../../utils/DateFormat.js";
import { RiDeleteBinLine } from "react-icons/ri";
import Spinner from "../other/Spinner.jsx";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-toastify";
import "../../comp-style/orderPage-style/OrderTicket.css";

const OrderTicket = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();

    const orderId = useSelector(state => state.order.currentOrderId)

    const {data: orderItems, isLoading: orderItemsLoading} = useGetItemsQuery(orderId);
    const {data: order, isLoading: orderLoading} = useGetOrderByIdQuery(orderId);

    const [addItem, {isLoading: addingItem}] = useAddItemMutation();
    const [removeItem, {isLoading: removingItem}] = useRemoveItemMutation();
    const [deleteItem, {isLoading: deletingItem}] = useDeleteItemMutation();

    if(orderItemsLoading || orderLoading){
        return (
            <div>
                <h3>Loading order items...</h3>
                <Spinner/>
            </div>
    )}

    // handle add item
    const handleAddItem = async(orderId, menuItemId) => {
        try{
            await addItem({orderId, menuItemId}).unwrap()
        }catch(error){
            toast.error("Item was not added on the order!")
        }
    }

    // handle remove item
    const handleRemoveItem = async(orderId, orderItemId) => {
        try{
            await removeItem({orderId, orderItemId}).unwrap()
        }catch(error){
            toast.error("Item was not removed from the order!")
        }
    }

    // handle delete item
    const handleDeleteItem = async(orderId, orderItemId) => {
        try{
            const response = await deleteItem({orderId, orderItemId}).unwrap()
            toast.success(response.response)
        }catch(error){
            toast.error(error?.data?.message || "Item was not deleted from the order!")
        }
    }


    return (
        <div className="order-panel ticket-panel">
            <h2>Order Ticket</h2>
            <h3>{formatDate(order.tableId.timeOpened)}</h3>
            <div className="ticket-meta">
                <h3>Table: {order.tableId.tableName}</h3>
                <h3>Time: {formatTime(order.tableId.timeOpened)}</h3>
            </div>

            <div className="ticket-items">
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems.length > 0 ? ( orderItems.map(item => (
                            <tr key={item._id}>
                                <td>{item.menuItemId.productName}</td>
                                <td>
                                    <button onClick={() => handleRemoveItem(orderId, item._id)} 
                                    disabled={addingItem || removingItem || deletingItem}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleAddItem(orderId, item.menuItemId._id)}
                                    disabled={addingItem || removingItem || deletingItem}>+</button>
                                </td>
                                <td>{item.linePrice} ALL</td>
                                <td>
                                    <button onClick={() => handleDeleteItem(orderId, item._id)}
                                    disabled={addingItem || removingItem || deletingItem}><RiDeleteBinLine /></button>
                                </td>
                            </tr>
                        ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="empty">Add the first item on this order</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="ticket-total">
                <h3>Total</h3>
                <h3><span>{order.total} ALL</span></h3>
            </div>
            
            <div className="order-actions">
                <button className="btn-checkout" onClick={() => nav("/checkout")}>Checkout</button>
                <button className="btn-delete" onClick={() => dispatch(setDiscardModal(true))}>Delete Order</button>
                <button className="btn-back" onClick={() => {dispatch(clearCurrentOrder()), nav(-1)}}>Back To Tables</button>
            </div>
        </div>
    )
}

export default OrderTicket;