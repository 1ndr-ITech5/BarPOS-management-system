import {Outlet, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

const ProtectedRoutes = ({allowedRoles}) => {
    const user = useSelector((state) => state.user.user)
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

    return user && roles.includes(user.role) ? <Outlet/> : <Navigate to="/tables"/>
}

export default ProtectedRoutes;