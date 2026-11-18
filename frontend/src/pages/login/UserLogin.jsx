import {useLoginMutation, useLoginDemoMutation} from "../../store/apis/authApi.js";
import {workspaceApi} from "../../store/apis/workspaceApi.js";
import {loginSuccess} from "../../store/slices/authSlice.js";
import {signOutWorkspace} from "../../store/slices/workspaceSlice.js";
import { IoArrowBack } from "react-icons/io5";
import { MdClear } from "react-icons/md";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {toast} from "react-toastify";
import "../../pages-style/login/UserLogin.css";

const UserLogin = () => {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const workspace = useSelector(state => state.workspace.currentWorkspace)

    const [login, {isLoading: logging}] = useLoginMutation();
    const [loginDemo, {isLoading: demoLogging}] = useLoginDemoMutation();

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
            nav("/tables")
            toast.success(response.response)
        }catch(error){
            toast.error(error?.data?.message || "User login failed!")
        }
    }

    const handleDemoLogin = async(userRole) => {
        try{
            const response = await loginDemo(userRole).unwrap()
            dispatch(loginSuccess(response.user))
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
        <div className="user-login-page">
            <div className="user-login">
                <div className="user-login-content">
                    <div className="user-login-brand">
                        <h2>BarPOS System</h2>
                        <h3>Point of sale Web App</h3>
                    </div>
                    <h2>{workspace.barName}</h2>
                </div>
                {workspace.type === "demo" ? 
                    <div className="demo-login-buttons">
                        <button onClick={() => handleDemoLogin({selectedRole: "admin"})} 
                            disabled={demoLogging}>Log As Admin</button>
                        <button onClick={() => handleDemoLogin({selectedRole: "waiter"})} 
                            disabled={demoLogging}>Log as Waiter</button>
                    </div> 
                : 
                    <div className="user-login-form">
                        <div className="code-display">
                            <button onClick={() => handleCodeVisibility()}>
                                {!showCode ? <FaRegEye/> : <FaRegEyeSlash/>}
                            </button>
                            <input type={showCode ? "text" : "password"} value={code} readOnly/>
                        </div>

                        <div className="keypad">
                            {Array.from({ length: 9 }, (_, index) => (
                                <button key={index + 1} type="button" onClick={() => handleInputCode(index + 1)}>
                                    {index + 1}
                                </button>
                            ))}
                            <button type="button" onClick={() => handleInputCode(0)}>0</button>
                            <button type="button" onClick={() => setCode((prevCode) => prevCode.slice(0, -1))}>
                                <IoArrowBack />
                            </button>
                            <button onClick={() => setCode("")}><MdClear /></button>
                        </div>
                    </div>}

                <div className="action-buttons">
                    {workspace.type !== "demo" && (
                        <button onClick={() => handleLogin()} disabled={logging}>Log In</button>
                    )}
                    <button onClick={() => handleSignOut()} disabled={demoLogging || logging}>Sign out</button>
                </div>
            </div>
        </div>
    )
}

export default UserLogin;