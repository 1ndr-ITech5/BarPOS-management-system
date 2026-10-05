import user from "../../assets/user.png";
import "../../comp-style/user-style/UserPanel.css";
import { FiLogOut } from "react-icons/fi";
import {useSelector} from "react-redux";

const UserPanel = () => {
    // get the user state with useSelector
    const userInfo = useSelector((state) => state.user.user)

    return (
        <div className="user-panel">
            <img src={user}/>
            <div className="user-name">
                <h1>{userInfo.first_name} {userInfo.last_name}</h1>
                <h2>{userInfo?.role}</h2>
            </div>
            <FiLogOut/>
        </div>
    )
}

export default UserPanel;