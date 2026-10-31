import {Outlet, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

const ProtectedRoutes = ({allowedRoles}) => {
    const user = useSelector((state) => state.user.user)
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

    if (!user) {
        return <Navigate to="/user-login" replace />
    }

    if (!roles.includes(user.role)) {
        return <Navigate to="/tables" replace />
    }

    return <Outlet/>
}

export default ProtectedRoutes;