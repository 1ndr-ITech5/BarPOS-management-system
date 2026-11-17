import {useGetMeQuery} from "../../store/apis/usersApi.js";
import {useGetWaiterStatsQuery, useGetReportQuery} from "../../store/apis/statsApi.js";
import { IoMdArrowRoundBack } from "react-icons/io";
import Spinner from "../../components/other/Spinner.jsx";
import {formatDate} from "../../utils/DateFormat.js";
import {useState} from "react";
import admin from "../../assets/admin.jpg";
import waiter from "../../assets/waiter.jpg";
import Register from "../../components/user/Register.jsx";
import {useNavigate} from "react-router-dom";
import "../../pages-style/other/Profile.css";

const Profile = () => {

    const nav = useNavigate()

    const [registerModal, setRegisterModal] = useState(false)
    const {data: user, isLoading: userLoading} = useGetMeQuery();

    const {data: waiterStats, isLoading: statsLoading} = useGetWaiterStatsQuery(undefined, {skip: !user || user.role === "admin"});
    const {data: waiterPerformances, isLoading: performancesLoad} = useGetReportQuery(undefined, {skip: !user || user.role === "waiter"});

    const loadingRole = () => {
        if (user?.role === "waiter"){
            return statsLoading
        }else{
            return performancesLoad
        }
    }

    if (userLoading || loadingRole()){
        return (
            <div className="loading">
                <h2>User's data loading...</h2>
                <Spinner/>
            </div>
        )
    }

    return (
        <div className="profile">
            <div className="left-side">
                <img src={user.role === "admin" ? admin : waiter}/>
                <div className="personal">
                    <h1>Personal Information</h1>
                    <h2>Full Name: {user.first_name} {user.last_name}</h2>
                    <h2>Role: {user.role}</h2>
                    <h2>Date Joined: {formatDate(user.createdAt)}</h2>
                </div>
                <div className="profile-buttons">
                    <button onClick={() => nav("/tables")}><IoMdArrowRoundBack/> Back to tables</button>
                    {(user.workspaceId.type === "real" && user.role === "admin") && 
                        <button onClick={() => setRegisterModal(true)}>Register new users</button>}
                </div>
            </div>
            {user.role === "waiter" ? (
                <div className="right-side-waiter">
                    <h1>Work Stats</h1>
                    <h2>Orders completed today: {waiterStats.todayCompletedOrders}</h2>
                    <h2>All time completed orders: {waiterStats.allCompletedOrders}</h2>
                </div>)
                 : (
                <div className="right-side-admin">
                    <h1>Today's Waiter Performances</h1>
                    <table>
                        <tr>
                            <th>Full Name</th>
                            <th>Completed Orders</th>
                        </tr>
                        {waiterPerformances.map(item => 
                        <tr key={item._id}>
                            <td>{item.first_name} {item.last_name}</td>
                            <td>{item.completedOrders}</td>
                        </tr>)}
                    </table>
                </div>)}
                {registerModal && <Register changeModal={setRegisterModal}/>}
        </div>
    )
}

export default Profile;