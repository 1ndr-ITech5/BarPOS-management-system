import {Outlet, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

const ProtectedRoutes = ({allowedRoles}) => {
    const workspace = useSelector(state => state.workspace.currentWorkspace)
    const user = useSelector((state) => state.user.user)
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

    if (!workspace) {
        return <Navigate to="/workspace-signin-page" replace />
    }

    if (!user) {
        return <Navigate to="/user-login" replace />
    }

    if (!roles.includes(user.role)) {
        return <Navigate to="/tables" replace />
    }
}

export default ProtectedRoutes;