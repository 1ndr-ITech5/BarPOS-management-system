import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import SideBar from "./SideBar.jsx";
import Footer from "./Footer.jsx";

const ProtectedLayout = () => {
    return (
        <>
            <Navbar />
            <SideBar/>

            <main>
                <Outlet />
            </main>

            <Footer/>
        </>
    )
}

export default ProtectedLayout;