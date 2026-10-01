import userlogo from "../../assets/user.png";
import { MdOutlinePayment } from "react-icons/md";
import {setCurrentOrder} from "../../store/slices/orderSlice.js";
import {setViewReceipt} from "../../store/slices/modalSlice.js";
import {formatDate} from "../../utils/DateFormat.js";
import {useDispatch} from "react-redux";
import "../../comp-style/cards-style/PaymentCard.css";

const PaymentCard = ({payment}) => {

    const dispatch = useDispatch();

    const datePart = formatDate(payment.createdAt)

    const handleClick = () => {
        dispatch(setCurrentOrder(payment.orderId._id))
        dispatch(setViewReceipt(true))
    }

    return(
        <div className="payment-card">
            <div>
                <h3>Date: {datePart}</h3>
                <h3>Total: {payment.totalAmount} ALL</h3>
            </div>
            <div className="fields">
                <img src={userlogo}/>
                <div>
                    <h2>{payment.waiterId.first_name} {payment.waiterId.last_name}</h2>
                    <p>{payment.waiterId.role}</p>
                </div>
            </div>
            <div className="fields">
                <MdOutlinePayment />
                <p>Payment Method: {payment.method}</p>
            </div>
            <button onClick={() => handleClick()}>View Receipt</button>
        </div>
    )
}

export default PaymentCard;