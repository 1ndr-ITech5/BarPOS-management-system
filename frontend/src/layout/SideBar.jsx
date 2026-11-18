import { MdOutlineTableRestaurant } from "react-icons/md";
import { IoReceiptOutline } from "react-icons/io5";
import { MdOutlinePayments } from "react-icons/md";
import { IoMdRemove } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { BiFoodMenu } from "react-icons/bi";
import {useSelector} from "react-redux";
import {NavLink} from "react-router-dom";
import "../layout-style/SideBar.css";

const SideBar = ({sideBar, setSideBar}) => {

    const user = useSelector(state => state.user.user)

    return (
        <div className={`sidebar ${sideBar ? "open" : ""}`}>
            <div className="sidebar-header">
                <h2 className="sidebar-title">Operations</h2>
                {sideBar && <button onClick={() => setSideBar(false)}><IoMdRemove /></button>}
            </div>
            <ul className="sidebar-menu">
                <li className="sidebar-item"><NavLink className="sidebar-link" to="/tables">
                <MdOutlineTableRestaurant/> Tables</NavLink></li>

                <li className="sidebar-item">{user.role === "admin" ? <NavLink className="sidebar-link" to="/menu-managment">
                <BiFoodMenu /> Menu Management</NavLink> : null}</li>

                <li className="sidebar-item">{user.role === "waiter" ? <NavLink className="sidebar-link" to="/my-orders">
                <IoReceiptOutline /> My Orders</NavLink> : <NavLink className="sidebar-link" to="/all-orders">
                <IoReceiptOutline /> All Orders</NavLink>}</li>
                
                <li className="sidebar-item">{user.role === "admin" ? <NavLink className="sidebar-link" to="/payments">
                <MdOutlinePayments /> Payments</NavLink> : null}</li>

                <li className="sidebar-item"><NavLink className="sidebar-link" to="/profile">
                <CgProfile /> Profile</NavLink></li>
            </ul>
            <h4 className="sidebar-footer">Powered by <span>NDR - Crafted Solutions</span></h4>
        </div>
    )
}

export default SideBar;