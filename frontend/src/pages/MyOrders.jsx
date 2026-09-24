import {useGetMyOrdersQuery} from "../store/apis/orderApi.js";
import MyOrdersCard from "../components/MyOrdersCard.jsx";
import {clearCurrentOrder} from "../store/slices/orderSlice.js";
import {useDispatch} from "react-redux";
import {useEffect} from "react";

const MyOrders = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearCurrentOrder())
    }, [dispatch])

    const {data: myOrders, isLoading, isError, error} = useGetMyOrdersQuery(undefined, {refetchOnMountOrArgChange: true});
    console.log(myOrders)

    if(isLoading){
        return <p>Loading your active orders...</p>
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
            <h1>My-Orders</h1>
            {myOrders.length > 0 ? (
                <div className="cards-container">
                {myOrders.map(order => (
                    <MyOrdersCard key={order._id} order={order}/>
                ))}
                </div>
            ) : 
            ( <p>No active orders found right now!</p> )}
        </div>
    )
}

export default MyOrders;