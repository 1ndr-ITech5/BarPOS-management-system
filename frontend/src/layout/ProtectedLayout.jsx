import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import SideBar from "./SideBar.jsx";
import "../layout-style/ProtectedLayout.css";

const ProtectedLayout = () => {
    return (
        <div className="app-layout">
            <Navbar />
            <div className="main-content-wrapper">
                <SideBar/>
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default ProtectedLayout;