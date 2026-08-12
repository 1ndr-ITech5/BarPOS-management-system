import {useNavigate, useLocation} from "react-router-dom";

const Checkout = () => {

    const nav = useNavigate();
    const location = useLocation();

    const {orderItems} = location.state || {}

    const total = orderItems.reduce((sum, item) => sum += (item.price * item.quantity) , 0)

    return(
        <div className="checkout">
            <h1>Checkout</h1>
            <h3>Table: </h3>
            <h3>Waiter: </h3>
            <div className="order-summary">
                <h2>Order Summary</h2>
                <div className="order-list">
                    <div>
                        <h3>Item</h3>
                        {orderItems.map(item => <p key={item.id}>{item.name}</p>)}
                    </div>
                    <div>
                        <h3>Quantity</h3>
                        {orderItems.map(item => <p key={item.id}>{item.quantity}</p>)}
                    </div>
                    <div>
                        <h3>Price</h3>
                        {orderItems.map(item => <p key={item.id}>{item.price * item.quantity}</p>)}
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
                    <input type="number" placeholder="put the number here..."/>
                </div>
                <div>
                    <p>Payment Method</p>
                    <input type="radio" name="choice" value="Cash"/>
                    <label for="Cash">Cash</label>

                    <input type="radio" name="choice" value="Card"/>
                    <label for="Card">Card</label>
                </div>
            </div>
            <div>
                <button onClick={() => nav("/payment-completed")}>Confirm</button>
                <button onClick={() => nav(-1)}>Back</button>
            </div>
        </div>
    )
}

export default Checkout;