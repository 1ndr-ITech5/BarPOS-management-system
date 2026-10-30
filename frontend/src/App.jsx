import Tables from "./pages/Tables.jsx";
import Login from "./pages/Login.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import ProtectedLayout from "./layout/ProtectedLayout.jsx";
import {Routes, Route, Navigate} from "react-router-dom";
import MyOrders from "./pages/MyOrders.jsx";
import MenuManagment from "./pages/MenuManagment.jsx";
import AllOrders from "./pages/AllOrders.jsx";
import Payments from "./pages/Payments.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import Checkout from "./pages/Checkout.jsx";
import PayCompleted from "./pages/PayCompleted.jsx";
import Profile from "./pages/Profile.jsx";
import './App.css';
import SemiProtectedRoutes from "./utils/SemiProtectedRoutes.jsx";
import ProtectedRoutes from "./utils/ProtectedRoutes.jsx";
import PublicRoute from "./utils/PublicRoute.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    return(
      <div className='app'>
          <main>
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/" element={<Navigate to="/workspace-signin-page" replace />} />
                <Route path="/workspace-signin-page" element={<Login />} />
              </Route>
              <Route element={<SemiProtectedRoutes/>}>
                <Route path="/user-login" element={<UserLogin/>}/>

                <Route element={<ProtectedRoutes allowedRoles={"waiter"}/>}>
                  <Route element={<ProtectedLayout/>}>
                  <Route path="/my-orders" element={<MyOrders/>}/>
                </Route>

                </Route>
                  <Route element={<ProtectedRoutes allowedRoles={"admin"}/>}>
                    <Route element={<ProtectedLayout/>}>
                      <Route path="/menu-managment" element={<MenuManagment/>}/>
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
                    <Route path="/profile" element={<Profile/>}/>
                  </Route>
                </Route>
              </Route>
            </Routes>
          </main>
          <ToastContainer/>
      </div>
    )
}

export default App;