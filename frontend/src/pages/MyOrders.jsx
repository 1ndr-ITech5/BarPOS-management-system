import {useGetMyOrdersQuery} from "../store/apis/orderApi.js";
import MyOrdersCard from "../components/MyOrdersCard.jsx";

const MyOrders = () => {

    const {data: myOrders, isLoading, refetch} = useGetMyOrdersQuery(undefined, {refetchOnMountOrArgChange: true});
    console.log(myOrders)

    if(isLoading){
        return <p>Loading your active orders...</p>
    }

    return (
        <div>
            <h1>My-Orders</h1>
            <div className="cards-container">
                {myOrders.map(order => (
                    <MyOrdersCard key={order._id} order={order}/>
                ))}
            </div>
        </div>
    )
}

export default MyOrders;