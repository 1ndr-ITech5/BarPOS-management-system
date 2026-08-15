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

const OrderPage = () => {

    const nav = useNavigate();

    const {data: items, isLoading} = useGetItemsQuery();

    const [orderItems, setOrderItems] = useState([])

    const table = useSelector(state => state.modals.selectedTable)

    const currentOrder = useSelector(state => state.order.currentOrderId)

    const [selectedCategory, setCategory] = useState("All")

    const [preBill, setPreBill] = useState(false)

    const [showDiscard, setShowDiscard] = useState(false)

    if(isLoading){
        return <p>Loading menu items...</p>
    }

    const handleDiscard = () => {
        setShowDiscard(false)
        dispatch(clearCurrentOrder())
        nav("/tables")
    }

    const handleAddItems = (product) => {
        // find if the existing product exists in the orderitems already
        setOrderItems((prevList) => {
            const existingItem = prevList.find(item => item.id === product.id)
            if(existingItem){
                const updatedItem = {...existingItem, quantity: existingItem.quantity + 1}
                // push this item into list
                const newList = prevList.map(item => {
                    if(item.id === product.id){
                        return updatedItem
                    }else{
                        return item
                    }
                })
                return newList;
            }else{
                return [
                    ...prevList, {...product, quantity: 1}
                ]
            }
        })
    }

    const handleRemoveItems = (product) => {
        setOrderItems((prevList) => {
            const existingItem = prevList.find(item => item.id === product.id)
            const updatedItem = {...product, quantity: existingItem.quantity - 1}
            if(existingItem.quantity > 1){
                const newList = prevList.map(item => {
                    if(item.id === existingItem.id){
                        return updatedItem
                    }else{
                        return item
                    }
                })
                return newList;
            }else{
                const newList = prevList.filter(item => item.id !== existingItem.id)
                return newList;
            }
            })
    }


    return(
        <div className="order-page">
            <div className="page-elements">
                <button onClick={() => {nav(-1)}}>Go Back</button>
                <h1>Order's Page</h1>
            </div>
            <div className="order-page-columns">
                <Categories menuItems={items} selectedCategory={selectedCategory} setCategory={setCategory}/>
                <Products menuItems={items} selectedCategory={selectedCategory} addProduct={handleAddItems}/>
                <OrderItems orderItems={orderItems} addProduct={handleAddItems} removeProduct={handleRemoveItems}/>
            </div>
            <div className="order-buttons">
                <button onClick={() => setShowDiscard(true)}>Delete</button>
                <button onClick={() => nav("/checkout")}>Checkout</button>
                <button onClick={() => setPreBill(true)}>Get Pre-Bill</button>
            </div>
            {preBill && <PreBill changePreBillModal={setPreBill} tableNo={table.tableNumber}/>}
            {showDiscard && <DiscardModal changeDiscardModal={handleDiscard} setShowDiscard={setShowDiscard} table={table}/>}
        </div>
    )
}

export default OrderPage;