import {useGetMeQuery} from "../store/apis/authApi.js";
import Spinner from "../components/other/Spinner.jsx";
import {formatDate} from "../utils/DateFormat.js";
import admin from "../assets/admin.jpg";
import waiter from "../assets/waiter.jpg";
import "../pages-style/Profile.css";

const Profile = () => {
    const {data: user, isLoading} = useGetMeQuery()
    console.log(user)

    if (isLoading){
        return (
            <div>
                <h2>User Info Data loading...</h2>
                <Spinner/>
            </div>
        )
    }

    return (
        <div className="profile">
            <img src={user.role === "admin" ? admin : waiter}/>
            <div className="personal">
                <h1>Personal Information</h1>
                <h2>Full Name: {user.first_name} {user.last_name}</h2>
                <h2>Username: {user.username}</h2>
                <h2>Role: {user.role}</h2>
                <h2>Date Joined: {formatDate(user.createdAt)}</h2>
            </div>
        </div>
    )
}

export default Profile;