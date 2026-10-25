import {useNavigate} from "react-router-dom";
import Categories from "../components/orderPage/Categories.jsx";
import Products from "../components/orderPage/Products.jsx";
import OrderItems from "../components/orderPage/OrderItems.jsx";
import PreBill from "../components/other/PreBill.jsx";
import DiscardModal from "../components/modals/DiscardModal.jsx";
import "../comp-style/orderPage-style/OrderPage.css";
import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {clearCurrentOrder, setPreBill} from "../store/slices/orderSlice.js";
import {setDiscardModal} from "../store/slices/modalSlice.js";
import {useAddItemMutation, useRemoveItemMutation} from "../store/apis/orderItemsApi.js";
import {useGetOrderByIdQuery} from "../store/apis/orderApi.js";
import Spinner from "../components/other/Spinner.jsx";
import {toast} from "react-toastify";

const OrderPage = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();

    const [addItem] = useAddItemMutation();
    const [removeItem] = useRemoveItemMutation();

    const orderId = useSelector(state => state.order.currentOrderId)
    const preBill = useSelector(state => state.order.preBillOrderId)
    const discardModal = useSelector(state => state.modals.discardModal)

    const {data: orderData, isLoading: orderLoading} = useGetOrderByIdQuery(orderId, {skip: !orderId})

    const [selectedCategory, setCategory] = useState("All")

    if (orderLoading) {
        return (
            <div>
                <h2>Loading order...</h2>
                <Spinner/>
            </div>      
        )
    }

    const handleAddItems = async(e, orderId, productId) => {
        e.preventDefault()
        try{
            await addItem({orderId, menuItemId: productId}).unwrap()
        }catch(error){
            toast.error(error?.data?.message)
        }
    }


    const handleRemoveItems = async(e, orderId, productId) => {
        e.preventDefault()

        try{
            await removeItem({orderId, menuItemId: productId}).unwrap()
        }catch(error){
            toast.error(error?.data?.message)
        }
    }


    return(
        <div className="order-page">
            <div className="page-elements">
                <button onClick={() => {dispatch(clearCurrentOrder()), nav(-1)}}>Go Back</button>
                <h1>Order's Page</h1>
            </div>
            <div className="order-page-columns">
                <Categories selectedCategory={selectedCategory} setCategory={setCategory}/>
                <Products selectedCategory={selectedCategory} addProduct={handleAddItems} orderId={orderData?.order?._id}/>
                <OrderItems orderItems={orderData ? orderData.orderItems : []} 
                addProduct={handleAddItems} removeProduct={handleRemoveItems}/>
            </div>
            <div className="order-buttons">
                <button onClick={() => dispatch(setDiscardModal(true))}>Delete</button>
                <button onClick={() => nav("/checkout")}>Checkout</button>
                <button onClick={() => dispatch(setPreBill(orderId))}>Get Pre-Bill</button>
            </div>
            {preBill && <PreBill orderData={orderData}/>}
            {discardModal && <DiscardModal tableId={orderData.order.tableId._id}/>}
        </div>
    )
}

export default OrderPage;