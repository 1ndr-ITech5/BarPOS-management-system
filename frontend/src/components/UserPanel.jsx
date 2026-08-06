import user from "../assets/user.png";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import "../comp-style/UserPanel.css";
import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {logout} from '../store/slices/authSlice.js';

const UserPanel = () => {
    // login modal
    const [loginModal, setLoginModal] = useState(false)

    // register modal
    const [registerModal, setRegisterModal] = useState(false)

    const dispatch = useDispatch()

    // get the user state with useSelector
    const userInfo = useSelector((state) => state.user.user)

    const handleLogout = () => {
        localStorage.removeItem("user")
        dispatch(logout())
    }


    return (
        <div className="user-panel">
            <div className="user-name">
                <img src={user}/>
                <h1>{userInfo ? `${userInfo.first_name} ${userInfo.last_name}` : "Guest"}</h1>
            </div>
            {userInfo && <h2>Role: {userInfo.role}</h2>}
            {(userInfo && userInfo.role === "admin") && <button onClick={() => setRegisterModal(true)} disabled={registerModal}>Register Users</button>}
            <button onClick={userInfo ? () => handleLogout() : () => setLoginModal(true)} disabled={loginModal}>{userInfo ? "Logout" : "Login"}</button>
            {/* Manage the login modal */}
            {loginModal && <Login changeModal={setLoginModal}/>}
            {/* Manage the register modal */}
            {registerModal && <Register changeModal={setRegisterModal}/>}
        </div>
    )
}

export default UserPanel;