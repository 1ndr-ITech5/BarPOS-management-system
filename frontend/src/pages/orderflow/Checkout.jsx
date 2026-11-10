import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useGetOrderByIdQuery} from "../../store/apis/orderApi.js";
import {useGetItemsQuery} from "../../store/apis/orderItemsApi.js";
import {useCreatePaymentMutation} from "../../store/apis/paymentApi.js";
import { BsCreditCardFill } from "react-icons/bs";
import { IoCashSharp } from "react-icons/io5";
import Spinner from "../../components/other/Spinner.jsx";
import {useState} from "react";
import { toast } from "react-toastify";

const Checkout = () => {
    const nav = useNavigate();
    const orderId = useSelector(state => state.order.currentOrderId)

    const {data: order, isLoading: orderLoading} = useGetOrderByIdQuery(orderId, {skip: !orderId})
    const {data: orderItems, isLoading: orderItemsLoading} = useGetItemsQuery(orderId, {skip: !orderId})
    const [createPayment, {isLoading}] = useCreatePaymentMutation();

    const [paymentData, setPaymentData] = useState({
        amountPaid: "",
        method: ""
    })

    if (orderLoading || orderItemsLoading) {
        return (
            <div>
                <h2>Fetching order data...</h2>
                <Spinner/>
            </div>      
        )
    }

    // count all the unique items in the order
    const countItems = new Set(
        (orderItems ?? []).map(item => item._id)
    ).size

    const handleChange = (e) => {
        const {name, value} = e.target;

        setPaymentData((prevData) => ({
            ...prevData,
            [name]: name === "amountPaid" ? Number(value) : value
        }))
    }

    const handlePayment = async() => {
        try{
            await createPayment({orderId, paymentData}).unwrap()
            nav("/payment-completed")
        }catch(error){
            toast.error(error?.data?.message || "Payment failed!")
        }
    }

    return(
        <div className="checkout">
            <h1>Order Summary</h1>
            <div className="order-details">
                <h3>Waiter: {order?.waiterId?.first_name} {order?.waiterId?.last_name}</h3>
                <h3>Table: {order?.tableId?.tableName}</h3>
            </div>
            <div className="order-list">
                <h2>List items <span>({countItems})</span></h2>
                <div className="item-list">
                    <table>
                        <tbody>
                            {orderItems.map(item => (
                                <tr>
                                    <td>x{item.quantity}</td>
                                    <td>{item.menuItemId.productName}</td>
                                    <td>{item.linePrice} ALL</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="payment-summary">
                <h3>Payment Summary</h3>
                <div className="payment-total">
                    <h2>Total</h2>
                    <h2>{order.total} ALL</h2>
                </div>
            </div>
            <div className="payment">
                <div className="pay-amount">
                    <label>Amount Received</label>
                    <input type="number" name="amountPaid" value={paymentData.amountPaid} 
                    placeholder="put the number here..." onChange={handleChange} required/>
                </div>
                <div className="pay-method">
                    <h3>Payment Method</h3>
                    <div className="pay-options">
                        <label className={`pay-option ${paymentData.method === "cash" ? "selected" : ""}`}>
                            <input type="radio" name="method" value="cash" 
                                checked={paymentData.method === "cash"} onChange={handleChange}/>
                            <span className="pay-icon"><IoCashSharp /></span>
                            <span className="pay-label">Cash</span>
                        </label>

                        <label className={`pay-option ${paymentData.method === "card" ? "selected" : ""}`}>
                            <input type="radio" name="method" value="card"
                                checked={paymentData.method === "card"} onChange={handleChange}/>
                            <span className="pay-icon"><BsCreditCardFill /></span>
                            <span className="pay-label">Card</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className="checkout-actions">
                <button onClick={() => nav(-1)}>Back To Order</button>
                <button disabled={isLoading} onClick={() => handlePayment()}>
                    {isLoading ? "Processing payment" : "Checkout"}</button>
            </div>
        </div>
    )
}

export default Checkout;