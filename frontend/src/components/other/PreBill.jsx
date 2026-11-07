import {useGetItemsQuery} from "../../store/apis/orderItemsApi.js";
import { CiCircleRemove } from "react-icons/ci";
import {formatDate, formatTime} from "../../utils/DateFormat.js";
import {setPreBill} from "../../store/slices/orderSlice.js";
import {useDispatch, useSelector} from "react-redux";
import Spinner from "./Spinner.jsx";
import "../../comp-style/other-style/PreBill.css";

const PreBill = ({order}) => {
    const dispatch = useDispatch()
    const barName = useSelector(state => state.workspace.currentWorkspace?.barName)
    const {data: orderItems = [], isLoading, isError} = useGetItemsQuery(order?._id, {skip: !order?._id})

    if (!order){
        return (
            <div className="pre-bill">
                <CiCircleRemove onClick={() => dispatch(setPreBill(false))}/>
                <p>Order data was not fetched. Refresh the page to try again.</p>
            </div>
        )
    }

    if (isLoading){
        return (
            <div className="pre-bill">
                <h1>Fetching order data...</h1>
                <Spinner />
            </div>
        )
    }

    if (isError){
        return (
            <div className="pre-bill">
                <CiCircleRemove onClick={() => dispatch(setPreBill(false))}/>
                <p>The order items could not be loaded. Please try again.</p>
            </div>
        )
    }

    return(
        <div className="pre-bill">
            <CiCircleRemove onClick={() => dispatch(setPreBill(false))}/>
            <h1>{barName}</h1>
            <div className="other-data">
                <h3>Waiter: {order.waiterId.first_name} {order.waiterId.last_name}</h3>
                <h3>Date: {formatDate(order.createdAt)}</h3>
                <h3>Time: {formatTime(order.createdAt)}</h3>
                <h3>Table: {order.tableId.tableName}</h3>
            </div>
            <table className="items-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {orderItems.length > 0 ? (
                        orderItems.map(item => (
                            <tr key={item._id}>
                                <td>{item.menuItemId.productName}</td>
                                <td>{item.quantity}</td>
                                <td>{item.linePrice}</td>
                            </tr>
                        ))
                    ) : (
                            <tr>
                                <td colSpan={3}>This order does not have an item yet</td>
                            </tr>
                        )
                    }
                </tbody>
                {orderItems.length > 0 && (
                <tfoot>
                    <tr>
                        <td colSpan={2}>Total ALL</td>
                        <td>{order.total}</td>
                    </tr>
                </tfoot>
                )}
            </table>
            <p>Thank you!</p>
            <p>Powered by BarPOS</p>
        </div>
    )
}

export default PreBill;