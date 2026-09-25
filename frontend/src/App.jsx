import Tables from "./pages/Tables.jsx";
import Header from "./layout/Header.jsx";
import Navbar from "./layout/Navbar.jsx";
import Footer from "./layout/Footer.jsx";
import {Routes, Route} from "react-router-dom";
import MyOrders from "./pages/MyOrders.jsx";
import AllOrders from "./pages/AllOrders.jsx";
import Payments from "./pages/Payments.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import Checkout from "./pages/Checkout.jsx";
import PayCompleted from "./pages/PayCompleted.jsx";
import './App.css';
import ProtectedRoutes from "./utils/ProtectedRoutes.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    return(
      <div className='app'>
          <Header/>
          <Navbar/>
          <main>
            <Routes>
              <Route path="/tables" element={<Tables/>}/>
              <Route element={<ProtectedRoutes allowedRoles={"waiter"}/>}>
                <Route path="/my-orders" element={<MyOrders/>}/>
              </Route>
              <Route element={<ProtectedRoutes allowedRoles={"admin"}/>}>
                <Route path="/all-orders" element={<AllOrders/>}/>
                <Route path="/payments" element={<Payments/>}/>
              </Route>
              <Route element={<ProtectedRoutes allowedRoles={["waiter", "admin"]}/> }>
                <Route path="/order-page" element={<OrderPage/>}/>
                <Route path="/checkout" element={<Checkout/>}/>
                <Route path="/payment-completed" element={<PayCompleted/>}/>
              </Route>
            </Routes>
          </main>
          <Footer/>
          <ToastContainer/>
      </div>
    )
}

export default App;