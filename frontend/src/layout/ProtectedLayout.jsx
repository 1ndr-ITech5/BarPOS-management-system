import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import SideBar from "./SideBar.jsx";

const ProtectedLayout = () => {
    return (
        <>
            <Navbar />
            <SideBar/>

            <main>
                <Outlet />
            </main>
        </>
    )
}

export default ProtectedLayout;