import {useNavigate} from "react-router-dom";
import Categories from "../orderPage-components/Categories.jsx";
import Products from "../orderPage-components/Products.jsx";
import OrderItems from "../orderPage-components/OrderItems.jsx";
import PreBill from "../components/PreBill.jsx";
import DiscardModal from "../components/DiscardModal.jsx";
import "../orderPage-style/OrderPage.css";
import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useGetItemsQuery} from "../store/apis/itemsApi.js";
import {clearCurrentOrder} from "../store/slices/orderSlice.js";
import {useAddItemMutation, useRemoveItemMutation} from "../store/apis/orderItemsApi.js";
import {useGetOrderQuery} from "../store/apis/orderApi.js";

const OrderPage = () => {

    const nav = useNavigate();
    const dispatch = useDispatch();
    const tableId = useSelector(state => state.modals.selectedTable)

    const [addItem] = useAddItemMutation();
    const [removeItem] = useRemoveItemMutation();

    const {data: items, isLoading} = useGetItemsQuery();
    const {data: orderData, isLoading: orderLoading} = useGetOrderQuery(tableId, {skip: !tableId})
    console.log(orderData)

    const [selectedCategory, setCategory] = useState("All")

    const [preBill, setPreBill] = useState(false)

    const [showDiscard, setShowDiscard] = useState(false)

    if(isLoading){
        return <p>Loading menu items...</p>
    }

    if (isLoading || orderLoading) {
        return <p>Loading order...</p>
    }

    const handleDiscard = () => {
        setShowDiscard(false)
        dispatch(clearCurrentOrder())
        nav("/tables")
    }

    const handleAddItems = async(e, orderId, productId) => {
        e.preventDefault()
        try{
            const response = await addItem({orderId, menuItemId: productId}).unwrap()
        }catch(error){
            console.log(error)
        }
    }


    const handleRemoveItems = async(e, orderId, productId) => {
        e.preventDefault()

        try{
            const response = await removeItem({orderId, menuItemId: productId})
        }catch(error){
            console.log(error)
        }
    }


    const backToTables = () => {
        localStorage.removeItem("currentTableId")
        nav(-1)
    }


    return(
        <div className="order-page">
            <div className="page-elements">
                <button onClick={() => backToTables()}>Go Back</button>
                <h1>Order's Page</h1>
            </div>
            <div className="order-page-columns">
                <Categories menuItems={items} selectedCategory={selectedCategory} setCategory={setCategory}/>
                <Products menuItems={items} selectedCategory={selectedCategory} addProduct={handleAddItems} orderId={orderData?.order?._id}/>
                <OrderItems orderItems={orderData?.orderItems} addProduct={handleAddItems} removeProduct={handleRemoveItems}/>
            </div>
            <div className="order-buttons">
                <button onClick={() => setShowDiscard(true)}>Delete</button>
                <button onClick={() => nav("/checkout")}>Checkout</button>
                <button onClick={() => setPreBill(true)}>Get Pre-Bill</button>
            </div>
            {preBill && <PreBill changePreBillModal={setPreBill} orderData={orderData}/>}
            {showDiscard && <DiscardModal changeDiscardModal={handleDiscard} setShowDiscard={setShowDiscard} tableId={tableId}/>}
        </div>
    )
}

export default OrderPage;