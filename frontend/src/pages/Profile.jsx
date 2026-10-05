import {useGetMeQuery} from "../store/apis/authApi.js";
import {useGetWaiterStatsQuery, useGetReportQuery} from "../store/apis/statsApi.js";
import { IoMdArrowRoundBack } from "react-icons/io";
import Spinner from "../components/other/Spinner.jsx";
import {formatDate} from "../utils/DateFormat.js";
import {useState} from "react";
import admin from "../assets/admin.jpg";
import waiter from "../assets/waiter.jpg";
import Register from "../components/user/Register.jsx";
import "../pages-style/Profile.css";

const Profile = () => {

    const [registerModal, setRegisterModal] = useState(false)
    const {data: user, isLoading: userLoading} = useGetMeQuery();

    const {data: waiterStats, isLoading: statsLoading} = useGetWaiterStatsQuery(undefined, {skip: !user || user.role === "admin"});
    const {data: waiterPerformances, isLoading: performancesLoad} = useGetReportQuery(undefined, {skip: !user || user.role === "waiter"});
    console.log(waiterPerformances)

    const loadingRole = () => {
        if (user?.role === "waiter"){
            return statsLoading
        }else{
            return performancesLoad
        }
    }

    if (userLoading || loadingRole()){
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
            {user.role === "waiter" ? (
                <div>
                    <h1>Work Stats</h1>
                    <h2>Orders completed today: {waiterStats.todayCompletedOrders}</h2>
                    <h2>All time completed orders: {waiterStats.allCompletedOrders}</h2>
                </div>)
                 : (
                <div>
                    <h1>Today's Waiter Performance</h1>
                    <div>
                        <h2>Waiter</h2>
                        <h2>Completed Orders</h2>
                    </div>
                    <div>
                        {waiterPerformances.map(item => <div key={item._id}>
                            <h3>{item.first_name} {item.last_name}</h3>
                            <h3>{item.completedOrders}</h3>
                        </div>)}
                    </div>
                    <div className="profile-buttons">
                        <button><IoMdArrowRoundBack/> Back to tables</button>
                        <button onClick={() => setRegisterModal(true)}>Register new users</button>
                    </div>
                    {registerModal && <Register changeModal={setRegisterModal}/>}
                </div>)}
        </div>
    )
}

export default Profile;