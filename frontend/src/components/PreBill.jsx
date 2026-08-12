import { CiCircleRemove } from "react-icons/ci";
import {useSelector} from "react-redux";
import "../comp-style/PreBill.css";

const PreBill = ({orderItems, changePreBillModal, tableNo}) => {

    const total = orderItems.reduce((sum, item) => sum += (item.price * item.quantity), 0)

    const user = useSelector(state => state.user.user)

    return(
        <div className="pre-bill">
            <CiCircleRemove onClick={() => changePreBillModal(false)}/>
            <h1>Bar Restorant Natyra</h1>
            <div className="other-data">
                <h3>Waiter: {user.first_name} {user.last_name}</h3>
                <h3>Date: </h3>
                <h3>Table: {tableNo}</h3>
            </div>
            <div className="items-list">
                <div className="item-columns">
                    <h2>Item</h2>
                    {orderItems.map(item => <p key={item.id}>{item.name}</p>)}
                </div>
                <div className="item-columns">
                    <h2>Quantity</h2>
                    {orderItems.map(item => <p key={item.id}>{item.quantity}</p>)}
                </div>
                <div className="item-columns">
                    <h2>Price</h2>
                    {orderItems.map(item => <p key={item.id}>{item.price * item.quantity}</p>)}
                </div>
            </div>
            <p>-------------------------------------------------------------------</p>
            <div className="total-bill">
                <h2>Total ALL</h2>
                <h2>{total}</h2>
            </div>
            <p>Thank you!</p>
            <p>Powered by BarPOS</p>
            <button>Download PDF</button>
        </div>
    )
}

export default PreBill;