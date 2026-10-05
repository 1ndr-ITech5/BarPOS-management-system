import user from "../../assets/user.png";
import "../../comp-style/user-style/UserPanel.css";
import {useSelector, useDispatch} from "react-redux";
import {clearCurrentOrder} from "../../store/slices/orderSlice.js";
import {logout} from '../../store/slices/authSlice.js';
import {api} from "../../store/apis/api.js";

const UserPanel = () => {

    const dispatch = useDispatch()

    // get the user state with useSelector
    const userInfo = useSelector((state) => state.user.user)

    const handleLogout = () => {
        localStorage.removeItem("user")
        dispatch(clearCurrentOrder())
        dispatch(api.util.resetApiState())
        dispatch(logout())
    }


    return (
        <div className="user-panel">
            <div className="user-name">
                <img src={user}/>
                <h1>{userInfo.first_name} {userInfo.last_name}</h1>
            </div>
            {userInfo && <h2>Role: {userInfo.role}</h2>}
            <button onClick={() => handleLogout()}>Log Out</button>
        </div>
    )
}

export default UserPanel;