import { MdOutlineTableRestaurant } from "react-icons/md";
import { IoReceiptOutline } from "react-icons/io5";
import { MdOutlinePayments } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";

const SideBar = () => {

    const user = useSelector(state => state.user.user)

    return (
        <div className="sidebar">
            <h2>Operations</h2>
            <ul>
                <li><Link to="/tables"><MdOutlineTableRestaurant/> Tables</Link></li>
                <li>{user.role === "waiter" ? <Link to="/my-orders"><IoReceiptOutline /> My Orders</Link> : <Link to="/all-orders"><IoReceiptOutline /> All Orders</Link>}</li>
                <li>{user.role === "admin" ? <Link to="/payments"><MdOutlinePayments /> Payments</Link> : null}</li>
                <li><Link to="/profile"><CgProfile /> Profile</Link></li>
            </ul>
            <h4>Powered by NDR - Crafted Solutions</h4>
        </div>
    )
}

export default SideBar;