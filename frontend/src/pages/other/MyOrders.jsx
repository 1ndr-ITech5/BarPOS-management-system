import {useGetMyOrdersQuery} from "../../store/apis/orderApi.js";
import OrdersCard from "../../components/cards/OrdersCard.jsx";
import {clearCurrentOrder} from "../../store/slices/orderSlice.js";
import Spinner from "../../components/other/Spinner.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import PreBill from "../../components/other/PreBill.jsx";
import { IoArrowBack } from "react-icons/io5";
import "../../pages-style/admin/AllOrders.css";

const MyOrders = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearCurrentOrder())
    }, [dispatch])

    const {data: myOrders, isLoading, isError, error} = useGetMyOrdersQuery(undefined, {refetchOnMountOrArgChange: true});
    const viewPreBill = useSelector(state => state.order.preBill)
    const [selectedOrder, setOrder] = useState(null)

    if(isLoading){
        return (
            <div>
                <h2>Loading your active orders...</h2>
                <Spinner/>
            </div>      
        )
    }

    if (isError) {
        if (error?.status === 404) {
            return <p>Orders could not be found.</p>
        }

        if (error?.status === 500) {
            return <p>Server error. Please try again later.</p>
        }

        return <p>Unable to fetch all orders. Please try again.</p>
    }

    return (
        <div className="all-orders-page">
            <h1>My Active Orders</h1>
            {myOrders.length > 0 ? (
                <div className="orders-container">
                {myOrders.map(order => (
                    <OrdersCard key={order._id} order={order} setOrder={setOrder}/>
                ))}
                </div>
            ) : (
            <div className="no-orders">
                <h2>No active order found right now!</h2>
                <button onClick={() => nav("/tables")}><IoArrowBack /> Back to Tables</button>
            </div>)}
            {viewPreBill && <div className="prebill-modal">
                <PreBill order={selectedOrder}/>
            </div>}
        </div>
    )
}

export default MyOrders;