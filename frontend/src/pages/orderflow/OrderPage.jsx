import ShowCategories from "../../components/orderPage/ShowCategories.jsx";
import MenuItems from "../../components/orderPage/MenuItems.jsx";
import OrderTicket from "../../components/orderPage/OrderTicket.jsx";
import DiscardModal from "../../components/modals/DiscardModal.jsx";
import {useSelector} from "react-redux";
import {useState} from "react";
import "../../pages-style/orderflow/OrderPage.css";

const OrderPage = () => {
    const discardModal = useSelector(state => state.modals.discardModal)
    const [selectedCategory, setCategory] = useState("All")

    return(
        <div className="order-page">
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