import {useGetAllPaymentsQuery} from "../store/apis/paymentApi.js";
import {setTimeFilter, setPayMethodFilter} from "../store/slices/filterSlice.js";
import {useSelector, useDispatch} from "react-redux";
import PaymentCard from "../components/PaymentCard.jsx";
import ViewReceipt from "../components/ViewReceipt.jsx";
import "../pages-style/Payments.css";

const Payments = () => {

    const dispatch = useDispatch();

    const timeFilter = useSelector(state => state.filters.timeFilter)
    const methodFilter = useSelector(state => state.filters.payMethodFilter)
    const receiptModal = useSelector(state => state.modals.receiptModal)

    const {data: allPayments, isLoading, isError, error} = useGetAllPaymentsQuery();
    console.log(allPayments)

    if(isLoading){
        return <p>Loading all payments...</p>
    }

    if (isError) {
        if (error?.status === 404) {
            return <p>Payments could not be found.</p>
        }

        if (error?.status === 500) {
            return <p>Server error. Please try again later.</p>
        }

        return <p>Unable to fetch all payments. Please try again.</p>
    }

    const filterPaymentsByDate = (allPayments, timeFilter) => {
    const today = new Date();

        return allPayments.filter(payment => {
            const date = new Date(payment.createdAt);

            if (timeFilter === "all") {
                return true;
            }

            if (timeFilter === "today") {
                return (
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear()
                );
            }

            if (timeFilter === "month") {
                return (
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear()
                );
            }

            if (timeFilter === "week") {
                const startOfWeek = new Date(today);
                const day = today.getDay();

                startOfWeek.setDate(today.getDate() - day);
                startOfWeek.setHours(0, 0, 0, 0);

                return date >= startOfWeek;
            }

            return true;
        });
    };

    const filteredPayments = filterPaymentsByDate(allPayments, timeFilter)

    const filterByPaymentMethod = filteredPayments.filter(payment => (
        methodFilter === "all" ? payment : (methodFilter === "cash" ? payment.method === "cash" : payment.method === "card")
    ))

    console.log(filteredPayments)
    console.log(filterByPaymentMethod)

    return (
        <div>
            <h1>Payments</h1>
            <label>Time</label>
            <select value={timeFilter} onChange={(e) => dispatch(setTimeFilter(e.target.value))}>
                <option value="all">All</option>
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
            </select>
            <label>Payment Method</label>
            <select value={methodFilter} onChange={(e) => dispatch(setPayMethodFilter(e.target.value))}>
                <option value="all">All</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
            </select>
            <div className="payments-container">
                {filterByPaymentMethod.map(payment => (
                    <PaymentCard key={payment._id} payment={payment}/>
                ))}
            </div>
            {receiptModal && <ViewReceipt/>}
        </div>
    )
}

export default Payments;