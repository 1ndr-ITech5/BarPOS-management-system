import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import SideBar from "./SideBar.jsx";
import {useState} from "react";
import "../layout-style/ProtectedLayout.css";

const ProtectedLayout = () => {

    const [mobileSideBar, setMobileSideBar] = useState(false)

    return (
        <div className="app-layout">
            <Navbar setSideBar={setMobileSideBar}/>
            <div className="main-content-wrapper">
                {mobileSideBar && 
                    <div className="sidebar-modal" />}
                <SideBar sideBar={mobileSideBar} setSideBar={setMobileSideBar}/>
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default ProtectedLayout;