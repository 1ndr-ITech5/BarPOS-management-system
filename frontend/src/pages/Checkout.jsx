import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useGetOrderByIdQuery} from "../store/apis/orderApi.js";
import {useCreatePaymentMutation} from "../store/apis/paymentApi.js";
import Spinner from "../components/other/Spinner.jsx";
import {useState} from "react";
import { toast } from "react-toastify";

const Checkout = () => {

    const nav = useNavigate();
    const orderId = useSelector(state => state.order.currentOrderId)

    const {data: orderData, isLoading: orderLoading, isError, error} = useGetOrderByIdQuery(orderId, {skip: !orderId})
    const [createPayment, {isLoading}] = useCreatePaymentMutation();

    const [paymentData, setPaymentData] = useState({
        amountPaid: "",
        method: ""
    })

    if (orderLoading) {
        return (
            <div>
                <h2>Fetching current order state...</h2>
                <Spinner/>
            </div>      
        )
    }

    if (isError) {
        if (error?.status === 403) {
            return (
                <div>
                    <p>You are not authorized to complete this payment!</p>
                    <button onClick={() => nav(-1)}>Back</button>
                </div>
            )
        }
        if (error?.status === 404) {
            return (
                <div>
                    <p>This order was not found!</p>
                    <button onClick={() => nav(-1)}>Back</button>
                </div>
            )
        }
        if (error?.status === 500) {
            return (
                <div>
                    <p>Server error. Please try again later.</p>
                    <button onClick={() => nav(-1)}>Back</button>
                </div>
            )
        }
        return (
            <div>
                <p>Unable to fetch the order data. Please try again.</p>
                <button onClick={() => nav(-1)}>Back</button>
            </div>
        )
    }

    if (!orderData) {
        return (
            <div>
                <p>This order was not found!</p>
                <button onClick={() => nav(-1)}>Back</button>
            </div>
        )
    }

    const handleChange = (e) => {
        const {name, value} = e.target;

        setPaymentData((prevData) => ({
            ...prevData,
            [name]: name === "amountPaid" ? Number(value) : value
        }))
    }

    const handlePayment = async(e) => {
        e.preventDefault();

        try{
            await createPayment({orderId, paymentData}).unwrap()
            nav("/payment-completed")
        }catch(error){
            toast.error(error.data.message)
        }
    }

    return(
        <div className="checkout">
            <h1>Checkout</h1>
            <h3>Table: {orderData.order.tableId.tableNumber}</h3>
            <h3>Waiter: {orderData.order.waiterId.first_name} {orderData.order.waiterId.last_name}</h3>
            <div className="order-summary">
                <h2>Order Summary</h2>
                <div className="order-list">
                    <div>
                        <h3>Item</h3>
                        {orderData.orderItems.map(item => <p key={item._id}>{item.menuItemId.productName}</p>)}
                    </div>
                    <div>
                        <h3>Quantity</h3>
                        {orderData.orderItems.map(item => <p key={item._id}>{item.quantity}</p>)}
                    </div>
                    <div>
                        <h3>Price</h3>
                        {orderData.orderItems.map(item => <p key={item._id}>{item.unitPrice * item.quantity}</p>)}
                    </div>
                    <p>-----------------------------------------------------</p>
                    <div>
                        <h2>Total in ALL - </h2>
                        <h2>{orderData.order.total}</h2>
                    </div>
                </div>
            </div>
            <div className="payment">
                <div>
                    <label>Amount Received</label>
                    <input type="number" name="amountPaid" value={paymentData.amountPaid} placeholder="put the number here..." onChange={handleChange} required/>
                </div>
                <div>
                    <p>Payment Method</p>
                    <input type="radio" name="method" value="cash" checked={paymentData.method === "cash"} onChange={handleChange}/>
                    <label>Cash</label>

                    <input type="radio" name="method" value="card" checked={paymentData.method === "card"} onChange={handleChange}/>
                    <label>Card</label>
                </div>
            </div>
            <div>
                <button disabled={isLoading} onClick={(e) => handlePayment(e)}>{isLoading ? "Processing payment" : "Confirm Payment"}</button>
                <button onClick={() => nav(-1)}>Back</button>
            </div>
        </div>
    )
}

export default Checkout;