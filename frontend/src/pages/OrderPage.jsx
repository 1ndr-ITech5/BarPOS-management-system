import {useNavigate} from "react-router-dom";
import Categories from "../components/orderPage/Categories.jsx";
import Products from "../components/orderPage/Products.jsx";
import OrderItems from "../components/orderPage/OrderItems.jsx";
import PreBill from "../components/other/PreBill.jsx";
import DiscardModal from "../components/modals/DiscardModal.jsx";
import "../comp-style/orderPage-style/OrderPage.css";
import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useGetItemsQuery} from "../store/apis/itemsApi.js";
import {clearCurrentOrder} from "../store/slices/orderSlice.js";
import {useAddItemMutation, useRemoveItemMutation} from "../store/apis/orderItemsApi.js";
import {useGetOrderQuery} from "../store/apis/orderApi.js";
import Spinner from "../components/other/Spinner.jsx";

const OrderPage = () => {

    const nav = useNavigate();
    const dispatch = useDispatch();
    const tableId = useSelector(state => state.modals.selectedTable)

    const [addItem] = useAddItemMutation();
    const [removeItem] = useRemoveItemMutation();

    const {data: items, isLoading} = useGetItemsQuery();
    const {data: orderData, isLoading: orderLoading} = useGetOrderQuery(tableId, {skip: !tableId})

    const [selectedCategory, setCategory] = useState("All")

    const [preBill, setPreBill] = useState(false)

    const [showDiscard, setShowDiscard] = useState(false)

    if (isLoading || orderLoading) {
        return (
            <div>
                <h2>Loading order...</h2>
                <Spinner/>
            </div>      
        )
    }

    const handleDiscard = () => {
        setShowDiscard(false)
        dispatch(clearCurrentOrder())
        nav("/tables")
    }

    const handleAddItems = async(e, orderId, productId) => {
        e.preventDefault()
        try{
            await addItem({orderId, menuItemId: productId}).unwrap()
        }catch(error){
            console.log(error)
        }
    }


    const handleRemoveItems = async(e, orderId, productId) => {
        e.preventDefault()

        try{
            await removeItem({orderId, menuItemId: productId})
        }catch(error){
            console.log(error)
        }
    }


    const backToTables = () => {
        dispatch(clearCurrentOrder())
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
                <OrderItems orderItems={orderData ? orderData.orderItems : []} addProduct={handleAddItems} removeProduct={handleRemoveItems}/>
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