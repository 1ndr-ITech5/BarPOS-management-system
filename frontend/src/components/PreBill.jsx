import { CiCircleRemove } from "react-icons/ci";
import "../comp-style/PreBill.css";

const PreBill = ({changePreBillModal, orderData}) => {

    // security check when orderData might come undefined
    if(!orderData){
        return(
            <div>
                <CiCircleRemove onClick={() => changePreBillModal(false)}/>
                <p>Order Data was not found!</p>
            </div>
        )
    }

    const dateTime = new Date(orderData.order.createdAt);

    // format the date part
    const date = dateTime.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // format the time part in 24-hour style
    const time = dateTime.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return(
        <div className="pre-bill">
            <CiCircleRemove onClick={() => changePreBillModal(false)}/>
            <h1>Bar Restorant Natyra</h1>
            <div className="other-data">
                <h3>Waiter: {orderData.order.waiterId.first_name} {orderData.order.waiterId.last_name}</h3>
                <h3>Date: {date}</h3>
                <h3>Time: {time}</h3>
                <h3>Table: {orderData.order.tableId.tableNumber}</h3>
            </div>
            <div className="items-list">
                <div className="item-columns">
                    <h2>Item</h2>
                    {orderData.orderItems.map(item => <p key={item._id}>{item.menuItemId.productName}</p>)}
                </div>
                <div className="item-columns">
                    <h2>Quantity</h2>
                    {orderData.orderItems.map(item => <p key={item._id}>{item.quantity}</p>)}
                </div>
                <div className="item-columns">
                    <h2>Price</h2>
                    {orderData.orderItems.map(item => <p key={item._id}>{item.unitPrice * item.quantity}</p>)}
                </div>
            </div>
            <p>-------------------------------------------------------------------</p>
            <div className="total-bill">
                <h2>Total ALL</h2>
                <h2>{orderData.order.total}</h2>
            </div>
            <p>Thank you!</p>
            <p>Powered by BarPOS</p>
            <button>Download PDF</button>
        </div>
    )
}

export default PreBill;