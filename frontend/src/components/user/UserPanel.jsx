import user from "../../assets/user.png";
import Register from "./Register.jsx";
import "../../comp-style/user-style/UserPanel.css";
import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {clearCurrentOrder} from "../../store/slices/orderSlice.js";
import {logout} from '../../store/slices/authSlice.js';
import {api} from "../../store/apis/api.js";
import {itemsApi} from "../../store/apis/itemsApi.js";

const UserPanel = () => {
    // register modal
    const [registerModal, setRegisterModal] = useState(false)

    const dispatch = useDispatch()

    // get the user state with useSelector
    const userInfo = useSelector((state) => state.user.user)

    const handleLogout = () => {
        localStorage.removeItem("user")
        dispatch(clearCurrentOrder())
        dispatch(api.util.resetApiState())
        dispatch(itemsApi.util.resetApiState())
        dispatch(logout())
    }


    return (
        <div className="user-panel">
            <div className="user-name">
                <img src={user}/>
                <h1>{userInfo.first_name} {userInfo.last_name}</h1>
            </div>
            {userInfo && <h2>Role: {userInfo.role}</h2>}
            {(userInfo && userInfo.role === "admin") && <button onClick={() => setRegisterModal(true)} disabled={registerModal}>Register Users</button>}
            <button onClick={() => handleLogout()}>Log Out</button>
            {/* Manage the register modal */}
            {registerModal && <Register changeModal={setRegisterModal}/>}
        </div>
    )
}

export default UserPanel;