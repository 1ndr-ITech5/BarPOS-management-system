import {useGetAllOrdersQuery} from "../store/apis/orderApi.js";
import MyOrdersCard from "../components/MyOrdersCard.jsx";
import {clearCurrentOrder} from "../store/slices/orderSlice.js";
import {useDispatch} from "react-redux";
import {useEffect} from "react";

const AllOrders = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearCurrentOrder())
    }, [])

    const {data: allOrders, isLoading} = useGetAllOrdersQuery();

    if (isLoading){
        return <p>Waiting for all orders...</p>
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