import logo from "../assets/logo.png";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import './Navbar.css'

const Navbar = () => {

    const user = useSelector((state) => state.user.user)

    return user ? (
        <div className="navbar">
            <img src={logo}/>
            <ul>
                <li><Link to="/tables">Tables</Link></li>
                <li>{user.role === "waiter" ? <Link to="/my-orders">My Orders</Link> : <Link to="/all-orders">All Orders</Link>}</li>
                <li>{user.role === "admin" ? <Link to="/payments">Payments</Link> : null}</li>
            </ul>
        </div>
    ) : (
        <div className="navbar">
            <img src={logo}/>
            <ul>
                <li><Link to="/tables">Tables</Link></li>
            </ul>
        </div>
    )
}

export default Navbar;