import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useGetOrderQuery} from "../store/apis/orderApi.js";
import {useCreatePaymentMutation} from "../store/apis/paymentApi.js";
import {useState} from "react";

const Checkout = () => {

    const nav = useNavigate();
    const tableId = useSelector(state => state.modals.selectedTable)
    const orderId = useSelector(state => state.order.currentOrderId)

    const {data: orderData, isLoading: orderLoading} = useGetOrderQuery(tableId, {skip: !tableId})
    const [createPayment] = useCreatePaymentMutation();

    const [paymentData, setPaymentData] = useState({
        amountPaid: "",
        method: ""
    })

    if (orderLoading) {
        return <p>Fetching current order state...</p>
    }

    const total = orderData.orderItems.reduce((sum, item) => sum += (item.unitPrice * item.quantity) , 0)

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
            const paymentResponse = await createPayment({orderId, paymentData}).unwrap()
            nav("/payment-completed")
        }catch(error){
            console.log(error)
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
                        <h2>{total}</h2>
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
                <button onClick={(e) => handlePayment(e)}>Confirm</button>
                <button onClick={() => nav(-1)}>Back</button>
            </div>
        </div>
    )
}

export default Checkout;