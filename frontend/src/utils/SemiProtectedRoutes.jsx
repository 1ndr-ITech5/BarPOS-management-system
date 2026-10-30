import {Outlet, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

const SemiProtectedRoutes = () => {
    const workspace = useSelector(state => state.workspace.currentWorkspace)
    console.log(workspace.workspace)

    return workspace ? <Outlet /> : <Navigate to="/workspace-signin-page" replace/>
}

export default SemiProtectedRoutes;