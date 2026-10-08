import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from "react-router-dom";
import {useLoginMutation, useLoginDemoMutation} from '../store/apis/authApi.js';
import {setCurrentWorkspace} from "../store/slices/modalSlice.js";
import {loginSuccess} from '../store/slices/authSlice.js';
import { toast } from "react-toastify";
import logHero from "../assets/logHero.jpg";
import logo from "../assets/logo.png";
import { GoPerson } from "react-icons/go";
import { LuLockKeyhole } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import '../pages-style/Login.css';

const Login = () => {
    // call our api hook for authentication
    const [login, {isLoading}] = useLoginMutation()
    const [loginDemo, {isLoading: loading}] = useLoginDemoMutation()

    const nav = useNavigate()
    const dispatch = useDispatch()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // what happens after button login gets clicked
    const handleSubmit = async(e) => {
        e.preventDefault();

        const response = await login({username, password})
        if (response.error){
            toast.error(response.error?.data?.message || "Login Failed!")
        }else{
            // set the user info in localstorage
            localStorage.setItem("user", JSON.stringify(response.data))
            dispatch(loginSuccess(response.data))
            dispatch(setCurrentWorkspace(response.data.workspaceId))
            nav("/tables")
            toast.success(response.data.response);
        }
    }

    // the demo case
    const handleSubmitDemo = async(e) => {
        e.preventDefault();

        const response = await loginDemo()
        if (response.error){
            toast.error(response.error?.data?.message || "Login Failed!")
        }else{
            // set the user info in localstorage
            localStorage.setItem("user", JSON.stringify(response.data))
            dispatch(loginSuccess(response.data))
            dispatch(setCurrentWorkspace(response.data.workspaceId))
            nav("/tables")
            toast.success(response.data.response);
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
                    <label>Username</label>
                    <GoPerson className="input-icon"/>
                    <input type="text" value={username} placeholder="Type your username..." onChange={(e) => setUsername(e.target.value)}/>
                    <label>Password</label>
                    <LuLockKeyhole className="input-icon"/>
                    <input type={showPassword ? "text" : "password"} value={password} placeholder="Type password..." onChange={(e) => setPassword(e.target.value)}/>
                    <button onClick={() => handlePasswordVisibility()}>{!showPassword ? <FaRegEye/> : <FaRegEyeSlash/>}</button>
                </div>
                <div className="log-actions">
                    <button onClick={(e) => handleSubmit(e)} disabled={isLoading || loading}>{isLoading ? "Logging in..." : "Sign In"}</button>
                    <button onClick={(e) => handleSubmitDemo(e)} disabled={loading || isLoading}>Try Live Demo</button>
                </div>
                <h3>Built by NDR - Crafted Solutions</h3>
            </div>
        </section>
    )
}

export default Login;