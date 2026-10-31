import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";

const PublicRoute = () => {
    const workspace = useSelector(state => state.workspace.currentWorkspace)
    const user = useSelector(state => state.user.user)

    if (workspace && user) return <Navigate to="/tables" replace />

    if (workspace) return <Navigate to="/user-login" replace />
    
    return <Outlet />
}

export default PublicRoute;