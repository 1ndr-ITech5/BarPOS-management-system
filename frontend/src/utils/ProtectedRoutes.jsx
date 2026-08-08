import {Outlet, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

const ProtectedRoutes = ({allowedRoles}) => {
    const user = useSelector((state) => state.user.user)
    
    return user && user.role === allowedRoles ? <Outlet/> : <Navigate to="/tables"/>
}

export default ProtectedRoutes;