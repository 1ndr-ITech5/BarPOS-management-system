import {useGetAllOrdersQuery} from "../store/apis/orderApi.js";
import MyOrdersCard from "../components/MyOrdersCard.jsx";
import {clearCurrentOrder} from "../store/slices/orderSlice.js";
import Spinner from "../components/Spinner.jsx";
import {useDispatch} from "react-redux";
import {useEffect} from "react";

const AllOrders = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearCurrentOrder())
    }, [dispatch])

    const {data: allOrders, isLoading, isError, error} = useGetAllOrdersQuery();

    if (isLoading){
        return (
            <div>
                <h2>Loading all current orders...</h2>
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
        <div>
            <h1>All-Orders</h1>
            {allOrders.length > 0 ? (<div className="all-orders">
                {allOrders.map(order => (
                    <MyOrdersCard key={order._id} order={order}/>
                ))}
            </div>) : (<p>No active order was found!</p>)}
        </div>
    )
}

export default AllOrders;