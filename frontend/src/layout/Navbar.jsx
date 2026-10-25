import logo from "../assets/logo.png";
import {FiSun} from "react-icons/fi";
import { IoMoonOutline } from "react-icons/io5";
import {changeToggle, resetToggle} from "../store/slices/pagesSlice.js";
import UserPanel from "../components/user/UserPanel.jsx";
import {clearCurrentOrder} from "../store/slices/orderSlice.js";
import {formatDate} from "../utils/DateFormat.js";
import {logout} from '../store/slices/authSlice.js';
import {api} from "../store/apis/api.js";
import {authApi} from "../store/apis/authApi.js";
import {useSelector, useDispatch} from "react-redux";
import {useEffect} from "react";
import '../layout-style/Navbar.css';

const Navbar = () => {
    const dispatch = useDispatch();
    const today = new Date()

    const user = useSelector((state) => state.user.user)
    const toggle = useSelector((state) => state.pages.toggle)

    useEffect(() => {
        localStorage.setItem("toggle", toggle);
    }, [toggle]);

    const handleLogout = () => {
        localStorage.removeItem("user")
        dispatch(resetToggle())
        dispatch(clearCurrentOrder())
        dispatch(authApi.util.resetApiState())
        dispatch(api.util.resetApiState())
        dispatch(logout())
    }

    return (
        <div className="navbar">
            <div className="brand">
                <img src={logo}/>
                <div className="brand-text">
                    <h1>{user.workspace}</h1>
                    <h2>Point of Sale Web App</h2>
                </div>
            </div>
            <h3 className="navbar-date">{formatDate(today)}</h3>
            <div className="navbar-actions">
                <button className="toggle-btn" onClick={() => dispatch(changeToggle())}>{toggle === "light" ? <FiSun/> : <IoMoonOutline/>}</button>
                <button className="user-btn" onClick={() => handleLogout()}><UserPanel/></button>
            </div>
        </div>
    )
}

export default Navbar;