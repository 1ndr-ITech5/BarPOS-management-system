import { CgProfile } from "react-icons/cg";
import { MdOutlinePayment } from "react-icons/md";
import { BsCalendarDate } from "react-icons/bs";
import { TbSum } from "react-icons/tb";
import {setCurrentOrder} from "../../store/slices/orderSlice.js";
import {setViewReceipt} from "../../store/slices/modalSlice.js";
import {formatDate} from "../../utils/DateFormat.js";
import {useDispatch} from "react-redux";
import "../../pages-style/admin/Payments.css";
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
            <div className="payment-details">
                <BsCalendarDate />
                <h3>Date: <span>{datePart}</span></h3>
            </div>
            <div className="fields">
                <CgProfile />
                <div className="waiter-details">
                    <h2>{payment.waiterId.first_name} {payment.waiterId.last_name}</h2>
                    <p>{payment.waiterId.role}</p>
                </div>
            </div>
            <div className="payment-details">
                <TbSum /> 
                <h3>Total: <span>{payment.totalAmount} ALL</span></h3>
            </div>
            <div className="payment-details">
                <MdOutlinePayment /> 
                <h3>Payment Method: <span>{payment.method}</span></h3>
            </div>
            <button onClick={() => handleClick()}>View Receipt</button>
        </div>
    )
} 

export default PaymentCard;