import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from "react-router-dom";
import {useLogRealWorkspaceMutation, useLogDemoWorkspaceMutation} from '../../store/apis/workspaceApi.js';
import {setWorkspace} from "../../store/slices/workspaceSlice.js";
import { toast } from "react-toastify";
import logHero from "../../assets/logHero.jpg";
import logo from "../../assets/logo.png";
import { GoPerson } from "react-icons/go";
import { LuLockKeyhole } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import '../../pages-style/Login.css';

const Login = () => {
    // call our api hook for workspace auth
    const [logRealWorkspace, {isLoading: workspaceLoading}] = useLogRealWorkspaceMutation();
    const [logDemoWorkspace, {isLoading: demoLoading}] = useLogDemoWorkspaceMutation();

    const nav = useNavigate()
    const dispatch = useDispatch()

    const [showPassword, setShowPassword] = useState(false)
    const [credentials, setCredentials] = useState({
        workspaceName: "",
        password: ""
    })

    // handle login credentials inserting
    const handleSignInCredentials = (e) => {
        const {name, value} = e.target

        setCredentials((prevCreds) => ({
            ...prevCreds,
            [name]: value
        }))
    }

    // what happens after button login gets clicked
    const handleSubmit = async() => {
        try{
            const response = await logRealWorkspace(credentials).unwrap()
            dispatch(setWorkspace(response.workspace))
            nav("/user-login")
            toast.success(response.response);
        }catch(error){
            toast.error(error?.data?.message || "Login Failed!")
        }
    }

    // the demo case
    const handleSubmitDemo = async() => {
        try{
            const response = await logDemoWorkspace().unwrap()
            dispatch(setWorkspace(response.workspace))
            nav("/user-login")
            toast.success(response.response);
        }catch(error){
            toast.error(error?.data?.message || "Login Failed!")
        }
    }

    const handlePasswordVisibility = () => {
        if (showPassword === true)
        {
            setShowPassword(false)
        }else{
            setShowPassword(true)
        }
    }

    return (
        <section className="login">
            <div className="login-hero" style={{ backgroundImage: `url(${logHero})` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="img-buttons">
                        <button>Live Tables</button>
                        <button>Order Control</button>
                        <button>Sales Reports</button>
                    </div>
                    <div className="description">
                        <h1>Everything your bar needs</h1>
                        <h1>in one place</h1>
                        <h3>From tables and orders, to payments and reports - BarPOS keeps the entire service under control</h3>
                    </div>
                </div>
            </div>
            <div className="login-form">
                <div className="log-page-header">
                    <img src={logo}/>
                    <div>
                        <h2>BarPOS Managment System</h2>
                        <h3>Point of Sale - Web App</h3>
                    </div>
                </div>
                <h1>Welcome Back</h1>
                <h2>Sign in with your POS account to start the till.</h2>
                <div className="log-fields">
                    <label>Workspace Name</label>
                    <GoPerson className="input-icon"/>
                    <input type="text" name="workspaceName" value={credentials.workspaceName} placeholder="Type your workspace name..." 
                    onChange={(e) => handleSignInCredentials(e)}/>

                    <label>Password</label>
                    <LuLockKeyhole className="input-icon"/>
                    <input type={showPassword ? "text" : "password"} name="password" value={credentials.password} 
                    placeholder="Type password..." onChange={(e) => handleSignInCredentials(e)}/>
                    <button onClick={() => handlePasswordVisibility()}>{!showPassword ? <FaRegEye/> : <FaRegEyeSlash/>}</button>
                </div>
                <div className="log-actions">
                    <button onClick={() => handleSubmit()} disabled={workspaceLoading || demoLoading}>
                        {(workspaceLoading || demoLoading) ? "Signing in..." : "Sign In"}</button>
                    <button onClick={() => handleSubmitDemo()} disabled={workspaceLoading || demoLoading}>
                        Try Live Demo</button>
                </div>
                <h3>Built by NDR - Crafted Solutions</h3>
            </div>
        </section>
    )
}

export default Login;