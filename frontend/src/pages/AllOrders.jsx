import {useGetAllOrdersQuery} from "../store/apis/orderApi.js";
import MyOrdersCard from "../components/MyOrdersCard.jsx";

const AllOrders = () => {

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