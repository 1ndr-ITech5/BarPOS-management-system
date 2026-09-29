import Tables from "./pages/Tables.jsx";
import Login from "./pages/Login.jsx";
import Header from "./layout/Header.jsx";
import Footer from "./layout/Footer.jsx";
import ProtectedLayout from "./layout/ProtectedLayout.jsx";
import {Routes, Route, Navigate} from "react-router-dom";
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
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/login-page" replace />} />
              <Route path="/login-page" element={<Login/>}/>
              <Route element={<ProtectedRoutes allowedRoles={"waiter"}/>}>
                <Route element={<ProtectedLayout/>}>
                  <Route path="/my-orders" element={<MyOrders/>}/>
                </Route>
              </Route>
              <Route element={<ProtectedRoutes allowedRoles={"admin"}/>}>
                <Route element={<ProtectedLayout/>}>
                  <Route path="/all-orders" element={<AllOrders/>}/>
                  <Route path="/payments" element={<Payments/>}/>
                </Route>
              </Route>
              <Route element={<ProtectedRoutes allowedRoles={["waiter", "admin"]}/> }>
                <Route element={<ProtectedLayout/>}>
                  <Route path="/tables" element={<Tables/>}/>
                  <Route path="/order-page" element={<OrderPage/>}/>
                  <Route path="/checkout" element={<Checkout/>}/>
                  <Route path="/payment-completed" element={<PayCompleted/>}/>
                  </Route>
              </Route>
            </Routes>
          </main>
          <Footer/>
          <ToastContainer/>
      </div>
    )
}

export default App;