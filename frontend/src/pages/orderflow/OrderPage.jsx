import ShowCategories from "../../components/orderPage/ShowCategories.jsx";
import MenuItems from "../../components/orderPage/MenuItems.jsx";
import OrderTicket from "../../components/orderPage/OrderTicket.jsx";
import DiscardModal from "../../components/modals/DiscardModal.jsx";
import {clearCurrentOrder} from "../../store/slices/orderSlice.js";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import "../../comp-style/orderPage-style/OrderPage.css";

const OrderPage = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();

    const discardModal = useSelector(state => state.modals.discardModal)
    const [selectedCategory, setCategory] = useState("All")

    return(
        <div className="order-page">
            <div className="page-elements">
                <button onClick={() => {dispatch(clearCurrentOrder()), nav(-1)}}>Go Back</button>
                <h1>Order's Page</h1>
            </div>
            <div className="order-page-columns">
                <ShowCategories selectedCategory={selectedCategory} setCategory={setCategory}/>
                <MenuItems selectedCategory={selectedCategory}/>
                <OrderTicket/>
            </div>
            {discardModal && <DiscardModal />}
        </div>
    )
}

export default OrderPage;