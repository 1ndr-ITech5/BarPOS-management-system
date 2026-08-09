import {useNavigate} from "react-router-dom"

const OrderPage = () => {

    const nav = useNavigate();
    return (
        <div>
            <h1>Order's Page</h1>
            <h3>Coming soon...</h3>
            <button onClick={() => nav(-1)}>Go Back</button>
        </div>
    )
}

export default OrderPage;