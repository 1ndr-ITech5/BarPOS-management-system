import {useGetPaymentQuery} from "../../store/apis/paymentApi.js";
import {useSelector, useDispatch} from "react-redux";
import { CiCircleRemove } from "react-icons/ci";
import {setViewReceipt} from "../../store/slices/modalSlice.js";
import {formatDate, formatTime} from "../../utils/DateFormat.js"
import Spinner from "./Spinner.jsx";
import "../../comp-style/other-style/ViewReceipt.css";

const ViewReceipt = () => {

    const dispatch = useDispatch();

    const orderId = useSelector(state => state.order.currentOrderId)
    const barName = useSelector(state => state.workspace.currentWorkspace.barName)

    const {data: payment, isLoading} = useGetPaymentQuery(orderId, {skip: !orderId});

    if(isLoading || !payment){
        return (
            <div>
                <h2>Loading the order's payment info...</h2>
                <Spinner/>
            </div>      
        )
    }

    const datePart = formatDate(payment.createdPayment.createdAt)
    const timePart = formatTime(payment.createdPayment.createdAt)

    return(
        <div className="receipt">
            <div className="container">
                <CiCircleRemove onClick={() => dispatch(setViewReceipt(false))}/>
            </div>
            <h1>{barName}</h1>
            <div className="other-data">
                <h3>Waiter: {payment.createdPayment.waiterId.first_name} {payment.createdPayment.waiterId.last_name}</h3>
                <h3>Date: {datePart}</h3>
                <h3>Time: {timePart}</h3>
                <h3>Table: {payment.createdPayment.orderId.tableId.tableName}</h3>
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
                    {payment.orderItems.map(item => (
                        <tr key={item._id}>
                            <td>{item.menuItemId.productName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.linePrice}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={2}>Total</td>
                        <td>ALL {payment.createdPayment.totalAmount}</td>
                    </tr>
                </tfoot>
            </table>
            <div className="payment-data">
                <table>
                    <tbody>
                        <tr>
                            <td>Paid</td>
                            <td>{payment.createdPayment.amountPaid} ALL</td>
                        </tr>
                        <tr>
                            <td>Paying Method</td>
                            <td>{payment.createdPayment.method}</td>
                        </tr>
                        <tr>
                            <td>Change</td>
                            <td>{payment.createdPayment.change} ALL</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>Thank you!</p>
            <p>Powered by BarPOS</p>
        </div>
    )
}

export default ViewReceipt;