import {useGetPaymentQuery} from "../store/apis/paymentApi.js";
import {useSelector, useDispatch} from "react-redux";
import { CiCircleRemove } from "react-icons/ci";
import {setViewReceipt} from "../store/slices/modalSlice.js";
import {formatDate, formatTime} from "../utils/DateFormat.jsx"
import Spinner from "../components/Spinner.jsx";

const ViewReceipt = () => {

    const dispatch = useDispatch();

    const orderId = useSelector(state => state.order.currentOrderId)

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
        <div>
            <CiCircleRemove onClick={() => {dispatch(setViewReceipt(false))}}/>
            <h1>BAR RESTORANT NATYRA</h1>
            <div>
                <h3>Waiter: {payment.createdPayment.waiterId.first_name} {payment.createdPayment.waiterId.last_name}</h3>
                <h3>Table: {payment.createdPayment.orderId.tableId.tableNumber}</h3>
                <h3>Date: {datePart}</h3>
                <h3>Time: {timePart}</h3>
                <h3>PaymentID: {payment.createdPayment._id}</h3>
            </div>
            <div>
                <h2>Item</h2>
                <h2>Quantity</h2>
                <h2>Price</h2>
            </div>
            <div>
                {payment.orderItems.map(item => <p key={item._id}>{item.menuItemId.productName}</p>)}
                {payment.orderItems.map(item => <p key={item._id}>{item.quantity}</p>)}
                {payment.orderItems.map(item => <p key={item._id}>{item.unitPrice * item.quantity}</p>)}
            </div>
            <div>
                <p>------------------------------------------------------</p>
                <h2>Total ALL</h2>
                <h2>{payment.createdPayment.totalAmount}</h2>
            </div>
            <div>
                <h3>Paid: {payment.createdPayment.amountPaid}</h3>
                <h3>Paying Method: {payment.createdPayment.method}</h3>
                <h3>Change: {payment.createdPayment.change}</h3>
            </div>
            <h2>Thank you!</h2>
        </div>
    )
}

export default ViewReceipt;