import {useSelector} from "react-redux";
import {Link} from "react-router-dom";

const SideBar = () => {

    const user = useSelector(state => state.user.user)

    return (
        <div className="sidebar">
            <h2>Operations</h2>
            <ul>
                <li><Link to="/tables">Tables</Link></li>
                <li>{user.role === "waiter" ? <Link to="/my-orders">My Orders</Link> : <Link to="/all-orders">All Orders</Link>}</li>
                <li>{user.role === "admin" ? <Link to="/payments">Payments</Link> : null}</li>
                <li><Link to="/profile">Profile</Link></li>
            </ul>
        </div>
    )
}

export default SideBar;