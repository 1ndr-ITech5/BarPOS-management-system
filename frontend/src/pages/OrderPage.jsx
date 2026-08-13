import {useNavigate} from "react-router-dom";
import Categories from "../orderPage-components/Categories.jsx";
import Products from "../orderPage-components/Products.jsx";
import OrderItems from "../orderPage-components/OrderItems.jsx";
import PreBill from "../components/PreBill.jsx";
import DiscardModal from "../components/DiscardModal.jsx";
import "../orderPage-style/OrderPage.css";
import {useState} from "react";
import {useSelector} from "react-redux";

const OrderPage = () => {

    const nav = useNavigate();

    const table = useSelector(state => state.modals.selectedTable)

    const [selectedCategory, setCategory] = useState("All")

    const [orderItems, setOrderItems] = useState([])

    const [preBill, setPreBill] = useState(false)

    const [showDiscard, setShowDiscard] = useState(false)

    const handleDiscard = () => {
        setShowDiscard(false)
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

    const menu = [
        {
            id: 1,
            name: "Burger",
            category: "Food",
            price: 300
        },
        {
            id: 2,
            name: "Bruschette",
            category: "Food",
            price: 400
        },
        {
            id: 3,
            name: "Beer",
            category: "Drinks",
            price: 120
        },
        {
            id: 4,
            name: "Baklava",
            category: "Dessert",
            price: 100
        }
    ]

    return(
        <div className="order-page">
            <div className="page-elements">
                <button onClick={() => nav(-1)}>Go Back</button>
                <h1>Order's Page</h1>
            </div>
            <div className="order-page-columns">
                <Categories menuItems={menu} selectedCategory={selectedCategory} setCategory={setCategory}/>
                <Products menuItems={menu} selectedCategory={selectedCategory} addProduct={handleAddItems}/>
                <OrderItems orderItems={orderItems} addProduct={handleAddItems} removeProduct={handleRemoveItems}/>
            </div>
            <div className="order-buttons">
                <button onClick={() => setShowDiscard(true)}>Delete</button>
                <button onClick={() => nav("/checkout", {state: {orderItems}})}>Checkout</button>
                <button onClick={() => setPreBill(true)}>Get Pre-Bill</button>
            </div>
            {preBill && <PreBill orderItems={orderItems} changePreBillModal={setPreBill} tableNo={table.tableNumber}/>}
            {showDiscard && <DiscardModal changeDiscardModal={handleDiscard} setShowDiscard={setShowDiscard} table={table}/>}
        </div>
    )
}

export default OrderPage;