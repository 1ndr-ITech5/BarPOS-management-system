import {useLoginMutation, useLoginDemoMutation} from "../store/apis/authApi.js";
import {workspaceApi} from "../store/apis/workspaceApi.js";
import {loginSuccess} from "../store/slices/authSlice.js";
import {setCurrentWorkspace} from "../store/slices/modalSlice.js";
import {signOutWorkspace} from "../store/slices/workspaceSlice.js";
import { FaDeleteLeft } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {toast} from "react-toastify";

const UserLogin = () => {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const workspace = useSelector(state => state.workspace.currentWorkspace)

    const [login, {isLoading: logging}] = useLoginMutation();
    // const [loginDemo, {isLoading: demoLogging}] = useLoginDemoMutation();

    const [code, setCode] = useState("")
    const [showCode, setShowCode] = useState(false)

    // handle number insert in code
    const handleInputCode = (number) => {
        if (code.length > 6) return;
        setCode((prevCode) => prevCode + number)
    }

    const handleCodeVisibility = () => {
        if (showCode === true) {setShowCode(false)}
        else {setShowCode(true)}
    }

    const handleLogin = async() => {
        try{
            const response = await login({code}).unwrap()
            dispatch(loginSuccess(response.user))
            dispatch(setCurrentWorkspace(response.user.workspaceId))
            nav("/tables")
            toast.success(response.response)
        }catch(error){
            toast.error(error?.data?.message || "User login failed!")
        }
    }

    const handleSignOut = () => {
        dispatch(signOutWorkspace())
        dispatch(workspaceApi.util.resetApiState())
        nav("/workspace-signin-page")
    }

    return (
        <div>
            <button>{workspace.barName}</button>
            {workspace.type === "demo" ? 
            <div>
                <button>Log As Admin</button>
                <button>Log as Waiter</button>
            </div> 
            : 
            <div>
                <div>
                    <label>Code</label>
                    <button onClick={() => handleCodeVisibility()}>{!showCode ? <FaRegEye/> : <FaRegEyeSlash/>}</button>
                    <input type={showCode ? "text" : "password"} value={code} readOnly/>
                    <button type="button" onClick={() => setCode((prevCode) => prevCode.slice(0, -1))}>
                        <FaDeleteLeft />
                    </button>
                </div>
                <div className="keypad">
                    {Array.from({ length: 10 }, (_, index) => (
                        <button key={index} type="button" onClick={() => handleInputCode(index)}>
                            {index}
                        </button>
                    ))}
                </div>
            </div>}
            <div className="action-buttons">
                <button onClick={() => {workspace.type !== "demo" ? handleLogin() : ""}} disabled={logging}>
                    {workspace.type === "demo" ? "" : "Log In"}</button>
                <button onClick={() => handleSignOut()}>Sign out</button>
            </div>
        </div>
    )
}

export default UserLogin;