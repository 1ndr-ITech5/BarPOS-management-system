import {useGetAllPaymentsQuery} from "../../store/apis/paymentApi.js";
import {setTimeFilter, setPayMethodFilter} from "../../store/slices/filterSlice.js";
import {filterPaymentsByDate, filterPaymentsByMethod, filterPaymentsByLastMonth} from "../../utils/FilterUtils.js";
import {useSelector, useDispatch} from "react-redux";
import {useState, useEffect} from "react";
import PaymentCard from "../../components/cards/PaymentCard.jsx";
import ViewReceipt from "../../components/other/ViewReceipt.jsx";
import Spinner from "../../components/other/Spinner.jsx";
import Revenue from "../../components/other/Revenue.jsx";
import { SiContactlesspayment } from "react-icons/si";
import { IoTimerOutline } from "react-icons/io5";
import { GrLinkNext } from "react-icons/gr";
import { IoArrowBack } from "react-icons/io5";
import "../../pages-style/admin/Payments.css";

const Payments = () => {

    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1)

    const timeFilter = useSelector(state => state.filters.timeFilter)
    const methodFilter = useSelector(state => state.filters.payMethodFilter)
    const receiptModal = useSelector(state => state.modals.receiptModal)

    const {data: allPayments, isLoading, isError, error} = useGetAllPaymentsQuery();
    const hasPayments = allPayments?.length > 0;

    // go to first page again on filter application
    useEffect(() => {
        setCurrentPage(1)
    }, [timeFilter, methodFilter])

    if(isLoading){
        return (
            <div className="loading">
                <h2>Loading all payments...</h2>
                <Spinner/>
            </div>      
        )
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

    const filteredPayments = filterPaymentsByDate(allPayments, timeFilter)
    const lastMonthPayments = filterPaymentsByLastMonth(allPayments)
    const filterByPaymentMethod = filterPaymentsByMethod(filteredPayments, methodFilter)

    const cardsPerPage = 9;
    const totalPages = Math.ceil(filterByPaymentMethod.length / cardsPerPage);

    const start = (currentPage - 1) * cardsPerPage;
    const end = currentPage * cardsPerPage;
    const renderedCards = filterByPaymentMethod.slice(start, end);

    return (
        <div className="payments-page">
            <h1>Payments</h1>
            <div className="filters">
                <div className="dropdown">
                    <label><IoTimerOutline /> Time Period</label>
                    <select value={timeFilter} onChange={(e) => dispatch(setTimeFilter(e.target.value))}>
                        <option value="Today">Today</option>
                        <option value="This week">This week</option>
                        <option value="This month">This month</option>
                        <option value="This year">This year</option>
                    </select>
                </div>
                <div className="dropdown">
                    <label><SiContactlesspayment /> Payment Method</label>
                    <select value={methodFilter} onChange={(e) => dispatch(setPayMethodFilter(e.target.value))}>
                        <option value="all">All</option>
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                    </select>
                </div>
            </div>
            <div className="revenue-container">
                <Revenue title={`${timeFilter}`} payments={filteredPayments} />
                <Revenue title="Last month" payments={lastMonthPayments}/>
                <Revenue title="All time" payments={allPayments}/>
            </div>
            {hasPayments ? (
                <div className="payments-container">
                    {renderedCards.map(payment => (
                        <PaymentCard key={payment._id} payment={payment}/>
                    ))}
                </div>
            ) : (
                <div className="no-payments">
                    <h2>No payments are registered for this time period!</h2>
                </div>
            )}
            <div className="pagination">
                <button onClick={() => setCurrentPage(currentPage - 1)} 
                    disabled={currentPage == 1}><IoArrowBack /> Previous</button>
                <p>Page {currentPage} of {totalPages}</p>
                <button onClick={() => setCurrentPage(currentPage + 1)} 
                    disabled={currentPage >= totalPages}><GrLinkNext /> Next</button>
            </div>
            {receiptModal && (
                <div className="receipt-modal-backdrop">
                    <ViewReceipt/>
                </div>
            )}
        </div>
    )
}

export default Payments;